"""Choose exterior reading navigation without changing independent panel controls."""


def reading_navigation_mode(endpoint, page_config=None):
    # Home/review routes and errors do not have a conventional reading timeline.
    if endpoint != "pages" or page_config is None:
        return "none"
    if page_config.template == "pages/team.html":
        return "none"
    # Keep the independently scrolling paper and its existing draggable neuron.
    if page_config.template == "pages/engineering.html":
        return "internal"
    return "cell"
