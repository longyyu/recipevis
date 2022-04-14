<script>
    import * as d3 from 'd3';
    
    export let data, xAccessor, yAccessor, xTrans, yTrans, barOpacity;    

    $: {
        let barContainer = d3.select(".bar-container");
        barContainer.html("");

        let bars = barContainer
                .append("g")
            .attr("class", "bar")
                .selectAll("g")
                .data(data)
                .enter()
            .append("g");

        bars
                .append('rect')
                .attr('height', yTrans.bandwidth())
                .attr('x', 0)
                .attr('y', d => yTrans(yAccessor(d)))
                .attr('fill', 'cadetblue')
                    .attr('opacity', barOpacity)
                    .attr('width', d => 0);

        bars
              .append('text')
                .attr('x', d => 0)
                .attr('y', d => yTrans(yAccessor(d)))
                .attr('dy', '1em')
                .text(d => `${yAccessor(d)}: ${(xAccessor(d)*100).toFixed(1)}%`)
                .style('font-size', '12px');        
        
        bars.selectAll('rect')
                .transition()
                .duration(400)
                .attr('width', d => xTrans(xAccessor(d)));
    }
</script>
