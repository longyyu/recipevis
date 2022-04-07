<script>
	import * as d3 from 'd3';
    import { ingdMap } from './stores';
	import { unravel, sortIngd } from './helper.svelte';

	let el,
        ingdMapLocal,
        width = 400,
        height = 500; // initial height
	const rectHeight = 23,
        xAccessor = d => +d[1],
        yAccessor = d => d[0],
        margin = {"left": 180, "top": 20},
        tickFontSize = 14;

    ingdMap.subscribe((v) => {
        ingdMapLocal = v;
    })

	export let data = Object.entries({
			"white sugar": 0.09122989134828009,
			"brown sugar": 0.10787924170377067,
			"flour": 0.3293212299251206,
			"egg": 0.053195970557816566,
			"vanilla": 0.004018092101244295,
			"chocolate chips": 0.2146972844144437,
			"salt": 0.0021000422867073617,
			"baking soda": 0.002505168086521261,
			"butter": 0.06450774369966705,
			"baking powder": 0.0004231828627222121,
			"nuts": 0.054853238450266614,
			"shortening": 0.019616921289335128,
			"margarine": 0.02643795311982074,
			"milk": 0.0022252756021543217,
			"water": 0.0027058563936450805,
			"oats": 0.01950083071670097,
			"cinnamon": 0.00018308532010197706,
			"peanut butter": 0.004598992121681309
	});
	height = rectHeight * data.map(yAccessor).length;

	$: {
        d3.select(el).selectAll("svg").remove();
		let svg = d3.select(el)
		    .append("svg")
						.attr("width", width)
						.attr("height", height)
		        .append("g")
						.style("transform", `translate(${margin.left}px, ${margin.top}px)`);

		let { maxDepth, ingdMapLayer } = unravel(ingdMapLocal);
		let yDomain;
        if (Object.entries(ingdMapLayer).length !== 0) {
            yDomain = sortIngd(data.map(yAccessor), ingdMapLayer[2]);
        } else {
            yDomain = data.map(yAccessor);
        }

		let xTrans = d3.scaleLinear()
                .domain([0, 0.5])
                .range([0, width]),
            // xAxis = svg.append("g")
            //     .attr("id", "xaxis"),
            yTrans = d3.scaleBand()
                .domain(yDomain)
                .range([0, height])
                .padding(.1),
            yAxis = svg.append("g")
                .attr("id", "yaxis"),
            yAxis2 = svg.append("g")
                .attr("id", "yaxis2")
                .style("transform", `translate(-${margin.left/2+14}px, 0px)`);

		/* xAxis.call(d3.axisTop(xTrans)); */
		yAxis.call(d3.axisLeft(yTrans).tickSize(0));
        yAxis.call(g => g.selectAll(".tick").attr("font-size", `${tickFontSize}px`));
		

        if (Object.entries(ingdMapLayer).length !== 0) {
            // get an object that maps a node (an ingd) to its parent
            let root = d3.hierarchy(ingdMapLocal, function(d) {
                return d.children;
            });
            let child2parent = {};
            root.descendants().forEach((d) => {
                let key = typeof d.data === "string" ? d.data : d.data.name;
                if (d.parent !== null) {
                    child2parent[key] = d.parent.data.name;	
                }
            })
            yAxis2.call(
                d3.axisLeft(yTrans)
                    .tickSize(0)
                    .tickFormat(d => child2parent[d])
            );
            yAxis2.call(g => g.select(".domain").attr("stroke", "#efefef"));
            yAxis2.call(g => g.selectAll(".tick").attr("font-size", `${tickFontSize}px`));
        }

		let bars = svg
            .append("g")
		    .attr("class", "bar")
            .selectAll("g")
				.data(data)
				.join("g");

		bars
            .append('rect')
            .attr('height', yTrans.bandwidth())
            .attr('x', 0)
            .attr('y', d => yTrans(yAccessor(d)))
            .attr('fill', 'cadetblue')
                .attr('opacity', 0.65)
                .attr('width', 0);
		
		bars.selectAll('rect')
            .transition()
            .duration(400)
            .attr('width', d => xTrans(xAccessor(d)));

		bars.append('text')
            .attr('x', d => 0)
            .attr('y', d => yTrans(yAccessor(d)))
            .attr('dy', '1em')
            .text(d => xAccessor(d).toFixed(2))
            .style('font-size', '12px');

		bars.selectAll('text')
            .transition()
            .duration(400)
            .attr('x', d => xTrans(xAccessor(d)));
	}
</script>

<div bind:this={el} bind:offsetWidth={width}></div>
