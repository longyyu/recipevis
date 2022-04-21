<script>
    import * as d3 from 'd3';
    import { recipeSelected } from './stores';
    
    export let data, width, height, yTrans, minOpacity, margin, binaryColor;

    const xAccessor = d => +d.recipe_id,
        yAccessor = d => d.ingd,
        opacityAccessor = d => (+d.ingd_pct),
        opacityTransContinuous = v => v === 0 ? 0 : minOpacity + v * 1.5,
        opacityTransBinary = v => v === 0 ? 0 : 0.55,
        tooltipOffsetX = 15;
    let opacityTrans;

    $: opacityTrans = binaryColor ? opacityTransBinary : opacityTransContinuous;

    $: {
        let xDomain = [...new Set(data.map(xAccessor))],
            xTrans = d3.scaleBand()
                .range([ 0, width ])
                .domain(xDomain)
                .padding(0.01);

        // Plot rectangles
        let tileContainer = d3.select(".tile-container");
        tileContainer.html("");
        let tiles = tileContainer
            .append("g")
            .attr("class", "tile")
            .selectAll("g")
            .data(data, function(d) {return d.recipe_id+':'+d.ingd;})
            .enter()
            .append("rect")
            .attr("x", d => xTrans(xAccessor(d)))
            .attr("y", d => yTrans(yAccessor(d)))
            .attr("width", xTrans.bandwidth() )
            .attr("height", yTrans.bandwidth() )
            .style("fill", "cadetblue")
            .style("opacity", d => opacityTrans(opacityAccessor(d)))
            .on("mouseover", function(event, d) {
                if (opacityAccessor(d) > 0) {
                    d3.selectAll(".tooltip").remove();
                    d3.select(".mainVis")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0.9)
                        .style("font-size", "var(--font-size-plot)")
                        .style("position", "absolute")
                        .style("background", "#ffffff80")
                        .html(`<span class="recipe_id">Recipe #${d.recipe_id}</span>
                        <br/><span class="ingd">${d.ingd}: ${(+d.ingd_pct*100).toFixed(2)}</span>%`)
                }
            })
            .on("mousemove", function(event, d) {
                d3.selectAll(".tooltip")
                    .style("transform", `translate(${
                        xTrans(xAccessor(d)) + margin.left + tooltipOffsetX
                    }px, ${
                        yTrans(yAccessor(d)) - height
                    }px)`)
            })
            .on("click", function(event, d) {
                recipeSelected.update(v => d);
            });
        
        // // show names of ingredients
        // tileContainer
        //     .append("g")
        //     .attr("class", "ingd-label")
        //     .selectAll("text")
        //     .data(yTrans.domain())
        //     .join("text")
        //     .attr("x", 0)
        //     .attr("y", d => yTrans(d))
        //     .html(d => d)
        //     .style("font-size", "var(--font-size-plot)")
        //     .style("transform", `translate(0px,${margin.top}px)`)
        //     .style("alignment-baseline", "ideographic");
    }
</script>