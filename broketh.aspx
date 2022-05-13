<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
   <link rel="icon" type="image/x-icon" href="./favicon.png">
    <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-2.4.2.min.js"></script>
    <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-gl-2.4.2.min.js"></script>
    <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-widgets-2.4.2.min.js"></script>
    <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-tables-2.4.2.min.js"></script>
    <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-mathjax-2.4.2.min.js"></script>

    <script type="text/javascript">
        Bokeh.set_log_level("info");
    </script>

    <link rel="stylesheet" href="https://pyscript.net/alpha/pyscript.css" />
    <script defer src="https://pyscript.net/alpha/pyscript.js"></script>

    <py-env>
        - bokeh
    </py-env>
	
</head>

<body>
<h1>Bokeh</h1>
<div id="myplot"></div>
<py-script id="main">

# Python code        
import json
import pyodide

from js import Bokeh, console, JSON

from bokeh.embed import json_item
from bokeh.plotting import figure
from bokeh.resources import CDN

# create a new plot with default tools, using figure
p = figure(plot_width=400, plot_height=400)

# add a circle renderer with x and y coordinates, size, color, and alpha
p.circle([1, 2, 3, 4, 5], [6, 7, 2, 4, 5], size=15, line_color="navy", fill_color="orange", fill_alpha=0.5)
p_json = json.dumps(json_item(p, "myplot"))

Bokeh.embed.embed_item(JSON.parse(p_json))
</py-script>

</body>

</html>