var width = 960,
height = 600;

var color = d3.scale.category20();

var force = d3.layout.force()
.charge(-120)
.linkDistance(200)
.size([width, height]);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function (d) {
  return  d.name + "";
})
svg.call(tip);

d3.json("/static/network.json", function(error, graph) {
  if (error) throw error;

  force
  .nodes(graph.nodes)
  .links(graph.links)
  .start();

  var link = svg.selectAll(".link")
  .data(graph.links)
  .enter().append("svg:line")
  .attr("class", "link")
  .style("stroke", "#ccc")
  .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
  .data(graph.nodes)
  .enter().append("g")
  .attr("class", "node")
  .call(force.drag);
  node.append("circle")
  .attr("r", 8)
  .style("fill", function (d) {
    return color(d.group);
  })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

  nodes = d3.selectAll(".node").data(graph.nodes)[0];
  var toggle = 0;
  var selection = -1;

  var adhd = [nodes[0], nodes[1], nodes[4], nodes[6], nodes[7], nodes[8], nodes[9], nodes[14], nodes[15], nodes[18], nodes[21], nodes[22], nodes[27], nodes[28], nodes[29], nodes[30], nodes[31], nodes[32], nodes[35], nodes[40], nodes[41]];
  var alz = [nodes[2], nodes[3], nodes[4], nodes[5], nodes[9], nodes[13], nodes[15], nodes[17], nodes[18], nodes[19], nodes[20], nodes[23], nodes[24], nodes[27], nodes[28], nodes[29], nodes[33], nodes[34], nodes[35], nodes[36], nodes[37]];
  var anxiety = [nodes[0], nodes[1], nodes[4], nodes[5], nodes[6], nodes[9], nodes[10], nodes[12], nodes[14], nodes[15], nodes[16], nodes[27], nodes[28], nodes[29], nodes[31], nodes[32], nodes[33], nodes[36], nodes[37], nodes[40], nodes[41]];
  var fpd = [nodes[0], nodes[1], nodes[4], nodes[6], nodes[9], nodes[14], nodes[15], nodes[21], nodes[22], nodes[30], nodes[31], nodes[32], nodes[33]];
  var mdd = [nodes[1], nodes[4], nodes[5], nodes[6], nodes[7], nodes[8], nodes[9], nodes[14], nodes[15], nodes[16], nodes[27], nodes[28], nodes[29], nodes[36], nodes[37]];
  var schiz = [nodes[0], nodes[1], nodes[6], nodes[9], nodes[11], nodes[14], nodes[15], nodes[16], nodes[27], nodes[31], nodes[33], nodes[36], nodes[38], nodes[39], nodes[40], nodes[41]];
  var holder = [adhd, alz, anxiety, fpd, mdd, schiz];

  $('#disorders').children()
  .on('click', function (event) {
    selection = event.target.id;
    highlightNodes(selection);
  });

  function highlightNodes(selection) {
    console.log(toggle);
    var num = parseInt(selection);
    var result = holder[num];
    for (i = 0; i < nodes.length; i++) {
      var circle = d3.select(nodes[i]).select('circle');
      if (toggle == 1) {
        circle.style({"fill": function (circle) {return color(circle.group);}, "opacity": 1})
        .attr("r", 8);
        if (i == nodes.length-1) { 
          toggle = 0;
          selection = -1; 
        }
      }
      else {
        if (result.indexOf(nodes[i]) < 0) {
          circle.style({"opacity": 0.3});
        }
        else {
          circle.style({"fill": "yellow"})
          .attr("r", 12);
        }
        if (i == nodes.length-1) { toggle = 1; }
      }
    }
  };

  var jsonHolder = ["/static/adhd.json",
                    "/static/alz.json", 
                    "/static/anxiety.json",
                    "/static/fpd.json",
                    "/static/mdd.json", 
                    "/static/schiz.json"];

  d3.selectAll(".node").on('click', function (event) {
    var selectedNode = d3.select(this);
    var circle = selectedNode.select('circle');
    var name = event.name;
    d3.json(jsonHolder[selection], function(error, graph) {
      if (error) return console.warn(error);
      if (toggle == 1 && circle.style("fill") == "rgb(255, 255, 0)") {
        for (i = 0; i < graph.nodes.length; i++) {
          if (name == graph.nodes[i].name) {
            controlPopup(name, graph.nodes[i].description);
          }
        }
      }
    });
  });

  function controlPopup(name, desc) {
    $('#node-info')[0].innerText = desc;
    $('#node-title')[0].innerText = name;
    if ($('#node-info')[0].innerText == desc) {
      $("[data-popup='node-popup']").fadeIn(350);
    }
  };

  force.on("tick", function () {
    link.attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });
    d3.selectAll("circle").attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
  });
});