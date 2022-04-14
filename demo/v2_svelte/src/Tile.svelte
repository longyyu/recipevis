<script>
    import * as d3 from 'd3';
    
    export let data, width, yTrans, minOpacity;

    const xAccessor = d => +d.recipe_id,
        yAccessor = d => d.ingd,
        opacityAccessor = d => (+d.ingd_pct),
        opacityTrans = v => v === 0 ? 0 : minOpacity + v * 1.5;

    $: {
        let tileContainer = d3.select(".tile-container");
        tileContainer.html("");

        // d3.csv("https://gist.githubusercontent.com/longyyu/d0bba5e9f7f6bd6e523382019137153b/raw/a5cc86a0bef4194cefc73a562520ab99270fa069/demo-ccc-recipes.csv").then(function(data) {
            // d3.json("/dataset/demo-ccc-recipes.json").then(function(data) {
            // Labels of row and columns
            let xDomain = [...new Set(data.map(xAccessor))];
                // yDomain = [...new Set(data.map(yAccessor))],
                // avgRecipe = computeAvgRecipe(data, xDomain.length),
                // selectedRecipeId;
            
            // Build X scales and axis:
            let xTrans = d3.scaleBand()
                .range([ 0, width ])
                .domain(xDomain)
                .padding(0.01);
                // xAxis = svg.append("g")
                //     .attr("class", "xtick");
                    // .style("transform", `translate(0, ${height}px)`);
            // xAxis.call(
            //     d3.axisTop(xTrans).tickSize(0).tickFormat(d => '')
            // );

            // Plot rectangles
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
                // .on("mouseover", function(d) {
                //     if (d.ingd_pct > 0) {
                //         tooltip
                //             .style("opacity", 0.9)
                //             .html(`Recipe #${d.recipe_id}, ${d.ingd}<br/>${(d.ingd_pct*100).toFixed(2)}%`)
                //     }
                // })
                // .on("mousemove", function() {
                //     tooltip
                //         .style("transform", `translate(${d3.event.pageX}px, ${d3.event.pageY-rect.top}px)`)
                // })
                // .on("mouseleave", function() {
                //     tooltip
                //         .style("opacity", 0)
                // })
                // .on("click", function(d) {
                //     recipeBox.selectAll("div").remove();
                //     let content = recipeBox.append("div")
                //         .attr("id", "recipe-box")
                //         .style("font-size", "var(--font-size-small)");
                //     content.append("p").html(`#${d.recipe_id}: ${d.title}`);
                //     content
                //         .append("ul")
                //         .attr("class", "ingd-list")
                //         .selectAll("li")
                //         .data(d.ingredients.split("^"))
                //         .enter()
                //         .append("li")
                //         .html(d => d);
                //     content.append("button")
                //         .attr("onclick", `window.open('https://${d.link}', '_blank')`)
                //         .text("Original recipe");

                //     selectedRecipeId = d.recipe_id;
                //     drawLine([avgRecipe, getRecipeIngd(data, selectedRecipeId)], content);
                // })
        // })
    }

</script>