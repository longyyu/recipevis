<script>
    import * as d3 from "d3";
    import { ingdMap } from './stores';

    // todo: reorder ingredients in main vis according to ingdMap
    let el, ingdMapLocal;

    ingdMap.subscribe((v) => {
        ingdMapLocal = v;
    })

    $: {
        d3.select(el).selectAll("div").remove();
        let dendro = d3.select(el).append("div"),
            width = 300,
            height = 260;
        
        // append the svg object to the body of the page
        let svg = dendro
            .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(40,0)");
        
        const cluster = d3.cluster()
            .size([height, width - 100]); 
        
        // Give the data to this cluster layout:
        const root = d3.hierarchy(ingdMapLocal, function(d) {
            return d.children;
        });
        cluster(root);

        // Add the links between nodes:
        svg.selectAll('path')
            .data( root.descendants().slice(1) )
            .join('path')
            .attr("d", function(d) {
                return `M${d.y},${d.x}` + 
                        `C${d.parent.y+50},${d.x} ` +
                        `${d.parent.y+50},${d.parent.x} ` +
                        `${d.parent.y},${d.parent.x}`;
            })
            .style("fill", 'none')
            .attr("stroke", '#ccc');

        // Add a circle for each node.
        let nodes = svg.selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", function(d) {
                return `translate(${d.y},${d.x})`
            });

        nodes
            .append("circle")
            .attr("r", 7)
            .style("fill", "cadetblue")
            .attr("stroke", "black")
            .style("stroke-width", 2);

        nodes.append("text")
            .text(d => "children" in d ? d.data.name : d.data)
            .attr("dx", -10)
            .attr("dy", -10)
            .style("font-size", "12px");
    }
</script>

<div bind:this={el}></div>
