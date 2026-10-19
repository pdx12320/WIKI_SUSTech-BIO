# Engineering cartoon faces

The ten supplied PNGs are the approved character sides of the Engineering Overview flip cards. `manifest.json` records source hashes, local dimensions, confirmed iGEM URLs and image-comparison results. The original Overview mechanism diagrams remain the default face.

The IO upload confirmed by the user is the `cb14f211df45` version. Its CDN AVIF measures 4000 × 2483, compared with the preserved 4833 × 3000 PNG; aspect ratio and pixel content were checked after matching dimensions. Cre–loxP uses the supplied clear replacement. The five Model subchapters share the existing PUFFER workflow and character. Fundamental Research and Functional Validation retain their original diagrams.

The inert `engineering_cartoon_assets.html` template uses the verified CDN URLs. The existing asset mapping resolves them back to these PNGs in local mode, including mounted previews. JavaScript clones those native image elements rather than constructing upload URLs.

Local static exports explicitly collect the ten PNG dependencies through the manifest-backed `engineering_cartoon_files` freezer generator. Production exports keep the verified CDN image URLs.
