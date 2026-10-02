/**
 * A single RNA backbone, continuous with the particle strand in onetake.js.
 * The two thin luminous edges bound ONE narrow ribbon: they are not paired
 * strands. Every base extends inward from that same ribbon, with no opposite
 * rail, pairing rungs, letters, textures, or separate decorative molecule.
 *
 * Geometry is built once. Four draw calls cover the ribbon, merged translucent
 * base slabs, merged outlines, and 34 moving glints; animation updates uniforms.
 */
export function createRnaRibbon(THREE, strand) {
  const { half, radius, pitch, baseStep } = strand;
  const tau = Math.PI * 2;
  const turn = tau / pitch;
  const group = new THREE.Group();
  group.name = 'single-rna-ribbon';
  group.visible = false;

  const opacity = { value: 0 };
  const clock = { value: 0 };
  const correction = { value: 0 };
  const shared = { uOpacity: opacity, uTime: clock, uFix: correction };
  const at = (x, r = radius) => [x, Math.cos(x * turn) * r, Math.sin(x * turn) * r];
  const palette = [0x5265b7, 0xb8a2ef, 0xefe6a7, 0xa3dbee].map((hex) => new THREE.Color(hex));
  const railColor = new THREE.Color(0xd8d6ff);
  const targetIndex = Math.round(half / baseStep);

  // A radial strip follows the exact analytical helix rather than a spline
  // approximation. Extra width outside the narrow core provides a soft halo.
  const railPositions = [], railUvs = [], railIndices = [];
  const segments = Math.ceil(half * 2 / .085);
  for (let i = 0; i <= segments; i++) {
    const x = -half + half * 2 * i / segments;
    railPositions.push(...at(x, radius - .25), ...at(x, radius + .25));
    railUvs.push(i / segments, -1, i / segments, 1);
    if (i < segments) {
      const n = i * 2;
      railIndices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
    }
  }
  const railGeometry = new THREE.BufferGeometry();
  railGeometry.setAttribute('position', new THREE.Float32BufferAttribute(railPositions, 3));
  railGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(railUvs, 2));
  railGeometry.setIndex(railIndices);
  railGeometry.computeBoundingSphere();
  const railMaterial = new THREE.ShaderMaterial({
    uniforms: shared,
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uOpacity, uTime;
      varying vec2 vUv;
      void main() {
        float across = abs(vUv.y);
        float core = 1.0 - smoothstep(0.37, 0.51, across);
        float edge = exp(-pow((across - 0.44) * 15.0, 2.0));
        float haze = pow(max(0.0, 1.0 - across), 2.0);
        float shimmer = 0.94 + 0.06 * sin(vUv.x * 65.0 - uTime * 1.3);
        vec3 ice = vec3(0.50, 0.76, 0.98);
        vec3 lavender = vec3(0.78, 0.60, 0.98);
        vec3 color = mix(ice, lavender, 0.5 + 0.5 * sin(vUv.x * 18.0));
        color += edge * vec3(0.22, 0.20, 0.25);
        float endFade = smoothstep(0.0, 0.018, vUv.x) * (1.0 - smoothstep(0.982, 1.0, vUv.x));
        gl_FragColor = vec4(color * shimmer, (core * 0.46 + edge * 0.38 + haze * 0.08) * uOpacity * endFade);
      }
    `,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const rail = new THREE.Mesh(railGeometry, railMaterial);
  group.add(rail);

  const basePositions = [], baseColors = [], baseTargets = [];
  const edgePositions = [], edgeColors = [], edgeTargets = [];
  const addEdge = (a, b, color, target = 0) => {
    edgePositions.push(...a, ...b);
    edgeColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    edgeTargets.push(target, target);
  };
  const face = (corners, indices, color, shade, target) => {
    for (const index of indices) {
      basePositions.push(...corners[index]);
      baseColors.push(color.r * shade, color.g * shade, color.b * shade);
      baseTargets.push(target);
    }
  };
  const baseCount = Math.floor(half * 2 / baseStep);
  for (let i = 0; i < baseCount; i++) {
    const x = i * baseStep - half;
    const th = x * turn, c = Math.cos(th), s = Math.sin(th);
    const origin = at(x);
    const tangent = new THREE.Vector3(1, -radius * turn * s, radius * turn * c).normalize();
    const radial = new THREE.Vector3(0, c, s);
    const normal = new THREE.Vector3().crossVectors(tangent, radial).normalize();
    const width = Math.min(.39, baseStep * .64);
    const length = (radius - .24) * [1, .88, .97, .91][i % 4];
    const target = i === targetIndex ? 1 : 0;
    const color = palette[i % palette.length];
    const corners = [];
    // Eight vertices make a thin acrylic-like slab. The broad faces are true
    // rectangles, perpendicular axes tangent/radial, attached to the backbone.
    for (let side = 0; side < 2; side++) {
      for (const [along, inward] of [[-.5, .035], [.5, .035], [.5, -length], [-.5, -length]]) {
        corners.push([
          origin[0] + tangent.x * width * along + radial.x * inward + normal.x * (side ? .026 : -.026),
          origin[1] + tangent.y * width * along + radial.y * inward + normal.y * (side ? .026 : -.026),
          origin[2] + tangent.z * width * along + radial.z * inward + normal.z * (side ? .026 : -.026),
        ]);
      }
    }
    face(corners, [0, 1, 2, 0, 2, 3], color, .92, target);
    face(corners, [4, 7, 6, 4, 6, 5], color, 1.07, target);
    for (let side = 0; side < 4; side++) {
      const next = (side + 1) % 4;
      face(corners, [side, side + 4, next + 4, side, next + 4, next], color, .66, target);
      addEdge(corners[side + 4], corners[next + 4], color, target);
    }
  }

  // Both edges belong to the same 0.22-wide ribbon, staying close together
  // instead of introducing a second helix on the opposite side of the axis.
  for (let i = 0; i < segments; i++) {
    const x0 = -half + half * 2 * i / segments;
    const x1 = -half + half * 2 * (i + 1) / segments;
    for (const r of [radius - .11, radius + .11]) addEdge(at(x0, r), at(x1, r), railColor);
  }

  const coloredGeometry = (positions, colors, targets) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(targets, 1));
    geometry.computeBoundingSphere();
    return geometry;
  };
  const coloredVertex = /* glsl */`
    attribute float aTarget;
    varying vec3 vColor;
    varying float vTarget;
    void main() {
      vColor = color;
      vTarget = aTarget;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const coloredFragment = /* glsl */`
    uniform float uOpacity, uTime, uFix, uAlpha, uLight;
    varying vec3 vColor;
    varying float vTarget;
    void main() {
      vec3 targetColor = mix(vec3(0.96, 0.44, 0.34), vec3(0.48, 0.91, 0.73), uFix);
      vec3 color = mix(vColor, targetColor, vTarget);
      float pulse = 1.0 + vTarget * 0.06 * sin(uTime * 1.8);
      gl_FragColor = vec4(color * uLight * pulse, uOpacity * uAlpha);
    }
  `;
  const coloredMaterial = (alpha, light, additive = false) => new THREE.ShaderMaterial({
    uniforms: { ...shared, uAlpha: { value: alpha }, uLight: { value: light } },
    vertexShader: coloredVertex, fragmentShader: coloredFragment,
    vertexColors: true, transparent: true, depthWrite: false,
    side: THREE.DoubleSide,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  const bases = new THREE.Mesh(
    coloredGeometry(basePositions, baseColors, baseTargets),
    coloredMaterial(.78, 1.08),
  );
  const edges = new THREE.LineSegments(
    coloredGeometry(edgePositions, edgeColors, edgeTargets),
    coloredMaterial(.49, 1.15, true),
  );
  group.add(bases, edges);

  const glintCount = 34;
  const glintPositions = new Float32Array(glintCount * 3);
  const glintSeeds = new Float32Array(glintCount);
  for (let i = 0; i < glintCount; i++) {
    glintPositions.set(at(-half + half * 2 * i / glintCount), i * 3);
    glintSeeds[i] = i / glintCount;
  }
  const glintGeometry = new THREE.BufferGeometry();
  glintGeometry.setAttribute('position', new THREE.BufferAttribute(glintPositions, 3));
  glintGeometry.setAttribute('aSeed', new THREE.BufferAttribute(glintSeeds, 1));
  glintGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), half + radius + 1);
  const glints = new THREE.Points(glintGeometry, new THREE.ShaderMaterial({
    uniforms: {
      ...shared, uHalf: { value: half }, uRadius: { value: radius }, uTurn: { value: turn },
    },
    vertexShader: /* glsl */`
      uniform float uTime, uHalf, uRadius, uTurn;
      attribute float aSeed;
      varying float vGlow;
      void main() {
        float x = (fract(aSeed + uTime * 0.009) * 2.0 - 1.0) * uHalf;
        float th = x * uTurn;
        float r = uRadius + 0.075 * sin(aSeed * 71.0 + uTime * 0.8);
        vec3 p = vec3(x, cos(th) * r, sin(th) * r);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vGlow = (0.55 + 0.45 * sin(aSeed * 97.0 + uTime * 2.2))
          * smoothstep(0.0, 0.75, uHalf - abs(x));
        gl_PointSize = clamp((38.0 + 14.0 * sin(aSeed * 81.0)) / max(1.0, -mv.z), 1.3, 8.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uOpacity;
      varying float vGlow;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        float halo = exp(-d * d * 5.0);
        gl_FragColor = vec4(0.79, 0.88, 1.0, halo * vGlow * uOpacity * 0.8);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  group.add(glints);

  const ease = (a, b, value) => {
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const window = (p, a, b, c, d) => ease(a, b, p) * (1 - ease(c, d, p));
  return {
    group,
    // p is the sampled TAKE progress P, not raw document scroll progress.
    // Use the same time and fix values as the main particle shader.
    update(p, stage, time, fix) {
      const story = window(p, .39, .425, .585, .615);
      const edit = window(p, .815, .84, .885, .905);
      const strandStage = ease(1.35, 1.85, stage) * (1 - ease(2.12, 2.65, stage));
      const editStage = ease(3.45, 3.95, stage) * (1 - ease(4.1, 4.5, stage));
      opacity.value = Math.min(1, story * strandStage + edit * editStage);
      clock.value = time;
      correction.value = Math.max(0, Math.min(1, fix));
      group.visible = opacity.value > .001;
    },
  };
}
