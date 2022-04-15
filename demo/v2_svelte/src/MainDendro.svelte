<script>
    import * as d3 from "d3";

    export let ingdMapLocal, yTrans,
		gapX, pathColor, nodeColor, nodeSize,
		nodeOpacityDefault, nodeOpacityHover;
    const getName = (d) => "children" in d ? d.data.name : d.data;
    $: {
        // computation for dendrogram (nodes, nodeX, nodeY)
        let root = d3.hierarchy(ingdMapLocal, function(d) {
            return d.children;
        });
        let nodeY = {}, nodeX = {};
        let nodes = root.descendants().reverse();

        nodes.forEach((d, i) => {
            let key = getName(d);
            nodeX[key] = -d.height * gapX;
            if (d.height === 0) {
                  // leaf nodes, height determined by corresponding bar
                    nodeY[key] = yTrans(key);
            } else {
                  // non-leaf nodes, height is the average of its children's
                    nodeY[key] = (
                        d.children.map(d => nodeY[getName(d)])
                            .reduce((a, b) => a + b) / d.children.length
                  );
            } // if
            nodes[i]["ingdName"] = key;
        })
        
        // dendrogram
        let dendroContainer = d3.select(".dendro-container");
        dendroContainer.html("");

        dendroContainer.selectAll("path")
            .data(nodes.filter(d => d.depth !== 0))
            .join("path")
            .attr("d", function(d) {
                  let dX = nodeX[d.ingdName], dY = nodeY[d.ingdName],
                                dParX = nodeX[d.parent.ingdName], dParY = nodeY[d.parent.ingdName],
                                dMidX = (dX + dParX) / 2;
                  return `M${dX},${dY}`+
                              `C${dMidX},${dY} `+
                                `${dMidX},${dParY} `+
                                `${dParX},${dParY}`;
            })
            .style("fill", "none")
            .attr("stroke", pathColor);
      
        let nonLeafNodes = dendroContainer.selectAll("g")
            .data(nodes.filter(d => d.height !== 0))
            .join("g")
            .style("transform", function(d) {
                  return `translate(`+
                              `${nodeX[d.ingdName]}px, `+
                              `${nodeY[d.ingdName]}px)`
            })
            .style("opacity", nodeOpacityDefault)
			.on("mouseover", function() {
				d3.select(this).style("cursor", "pointer").style("opacity", nodeOpacityHover);
			})
            .on("mouseout", function() {
                d3.select(this).style("opacity", nodeOpacityDefault);
			});
        
        nonLeafNodes.append("circle")
            .attr("r", nodeSize)
            .style("fill", nodeColor);

        nonLeafNodes.append("text")
            .attr("dx", "-.5em")
            .text(d => d.ingdName)
            .style("font-size", "var(--font-size-plot)")
            .style("fill", nodeColor)
            .style("text-anchor", "end")
            .style("alignment-baseline", "middle");
    }
</script>
