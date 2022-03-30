// accessor functions
const xAccessor = d => +d.recipe_id,
    yAccessor = d => d.ingd,
    opacityAccessor = d => (+d.ingd_pct);

// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 50, left: 150},
    minCanvasHeight = 400,
    rectHeight = 20;
let rect,
    outerWidth, outerHeight = minCanvasHeight,
    width, height,
    legendPosX = 20, legendPosY;
let ingdMap = {};

// initialize dimension parameters
function updateDimensionWidth() {
    rect = document.querySelector("#main-viz").getBoundingClientRect();
    outerWidth = rect.width;
    width = outerWidth - margin.left - margin.right;
}
updateDimensionWidth();

let tooltip = d3.select("#main-viz")
        .append("div")
        .attr("id", "tooltip")
        .style("width", "230px")
        .style("height", "0px")
        .style("font-size", "14px"),
    infoBox = d3.select("#details-view")
        .style("transform", `translate(0, ${margin.top})`)
    recipeBox = d3.select("#details-view");

// append the svg object to the body of the page
let svg = d3.select("#main-viz")
    .append("svg")
    .style("width", `${outerWidth}px`)
    .style("height", `${outerHeight}px`)
    .append("g")
    .style("transform", `translate(${margin.left}px, ${margin.top}px)`);

//Read the data
d3.csv("/dataset/demo-ccc-recipes.csv").then(function(data) {
// d3.json("/dataset/demo-ccc-recipes.json").then(function(data) {
    // Labels of row and columns
    let xDomain = [...new Set(data.map(xAccessor))],
        yDomain = [...new Set(data.map(yAccessor))],
        avgRecipe = computeAvgRecipe(data, xDomain.length),
        selectedRecipeId;
    // update plot dimension (height)
    height = yDomain.length * rectHeight;
    outerHeight = height + margin.top + margin.bottom;
    legendPosY = height/2 - 90;
    svg.style("height", `${outerHeight}px`);

    // todo: reorder ingredients
    // initialize ingredient categorization mapper
    // ingdMap = {"white sugar": "sugar", "brown sugar": "sugar"};
    ingdMap = {
        "name": "all ingredients",
        "children": [
            {"name": "sweentener", "children": ["white sugar", "brown sugar"]},
            {"name": "leavener", "children": ["baking soda", "baking powder"]}
        ]
    };
    updateToolRow();
    
    // Build X scales and axis:
    let xTrans = d3.scaleBand()
            .range([ 0, width ])
            .domain(xDomain)
            .padding(0.01),
        xAxis = svg.append("g")
            .attr("class", "xtick");
            // .style("transform", `translate(0, ${height}px)`);
    xAxis
        .call(
            d3.axisTop(xTrans).tickSize(0)
        );

    // Build Y scales and axis:
    let yTrans = d3.scaleBand()
            .range([ 0, height ])
            .domain(yDomain)
            .padding(0.01),
        yAxis = svg.append("g")
            .attr("class", "ytick")
            .style("z-index", 9)
            .style("font-size", "12px")
            .style("transform", `translate(0px, 0px)`);
    yAxis
        .call(d3.axisLeft(yTrans).tickSize(0));

    // Plot rectangles
    let tiles = svg.append("g")
        .attr("class", "tile")
        .selectAll()
        .data(data, function(d) {return d.recipe_id+':'+d.ingd;})
        .enter()
        .append("rect")
        .attr("x", d => xTrans(xAccessor(d)))
        .attr("y", d => yTrans(yAccessor(d)))
        .attr("width", xTrans.bandwidth() )
        .attr("height", yTrans.bandwidth() )
        .style("fill", "cadetblue")
        .style("opacity", d => opacityAccessor(d) === 0 ? 0 : 0.1+opacityAccessor(d))
        .on("mouseover", function(d) {
            if (d.ingd_pct > 0) {
                tooltip
                    .style("opacity", 0.9)
                    .html(`Recipe #${d.recipe_id}, ${d.ingd}<br/>${(d.ingd_pct*100).toFixed(2)}%`)
            }
        })
        .on("mousemove", function() {
            tooltip
                .style("transform", `translate(${d3.event.pageX}px, ${d3.event.pageY-rect.top}px)`)
        })
        .on("mouseleave", function() {
            tooltip
                .style("opacity", 0)
        })
        .on("click", function(d) {
            recipeBox.selectAll("div").remove();
            let content = recipeBox.append("div")
                .attr("id", "recipe-box")
                .style("font-size", "var(--font-size-small)");
            content.append("p").html(`#${d.recipe_id}: ${d.title}`);
            content
                .append("ul")
                .attr("class", "ingd-list")
                .selectAll("li")
                .data(d.ingredients.split("^"))
                .enter()
                .append("li")
                .html(d => d);
            content.append("button")
                .attr("onclick", `window.open('https://${d.link}', '_blank')`)
                .text("Original recipe");

            selectedRecipeId = d.recipe_id;
            drawLine([avgRecipe, getRecipeIngd(data, selectedRecipeId)], content);
        })
    
    // responsive layout
    // todo: update the xAxis, yAxis
    function handleResize() {
        updateDimensionWidth();
        svg.style("width", `${outerWidth}px`);
        console.log("Resizing")
        xScale.range([0, width]);
        xTrans.range([ 0, width ]);
        d3.select(".xaxis").call(
                d3.axisBottom(xScale).tickSize(0)
            );
        d3.select(".xtick")
            .call(
                d3.axisTop(xTrans).tickSize(0)
            );
    }
    window.onresize = handleResize;
}) // d3.csv

function computeAvgRecipe(data, numRecipes) {
    let avgRecipe = {};
    data.forEach((d) => {
        if (d.ingd in avgRecipe) {
            avgRecipe[d.ingd] += (+d.ingd_pct)
        } else {
            avgRecipe[d.ingd] = (+d.ingd_pct)
        }
    });
    return Object.fromEntries(
        Object.entries(avgRecipe).map(d => [d[0], d[1] / numRecipes])
    )
}

function getRecipeIngd(data, selectedId) {
    return Object.fromEntries(
        data.filter(function(d) {return d.recipe_id === selectedId}).map(d => [d.ingd, +d.ingd_pct])
    )
}

// Plot line chart to compare recipes
function drawLine(data, plotArea) {
    // Set SVG width, height, and padding
    const outerWidth = 380, outerHeight = 230,
         margin = {top: 10, right: 10, bottom: 70, left: 50},
         width = outerWidth - margin.left - margin.right,
         height = outerHeight - margin.top - margin.bottom;

    // Append an svg to the plot_area div
    let svg = plotArea
        // .append("div")
        .append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .append('g')
        .style("transform", `translate(${margin.left}px, ${margin.top}px)`);

    // Set color
    let color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.range(data.length)),
    // Set axis limits
        yMin = 0, yMax = 0.5,
    // Set x and y-axis scales
        xRange = Object.entries(data[0])
            .sort(function(a, b) {return b[1] - a[1]})
            .map(d => d[0]),
        xScale = d3.scaleBand()
            .domain(xRange)
            .range([0, width]),
        yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);
    let xSort = {};
    xRange.forEach((d, i) => {xSort[d] = i});
    
    // Add x-axis
    svg.append('g')
        .attr("class", "xaxis")
        .style('font-size', '12px')
        .style('position', 'relative')
        .style('transform', `translate(0, ${height}px)`)
        .call(
            d3.axisBottom(xScale).tickSize(0)
    	)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");

    // Add y-axis
    svg.append('g')
        .style('font-size', '12px')
        .attr('transform', `translate(0, 0)`)
        .call(d3.axisLeft(yScale));

    // Trim data points to only be in range of y-axis
    // needs update
    /* let data_in_range = data.filter(
        e => (e[0] >= yMin && e[0] <= yMax)
    ) */
    let data_in_range = data;
    
    let lines = svg.selectAll("whatever")
	        .data(data_in_range)
	        .enter()
	        .append("g");

	lines.each(function(d, i) {
        let curLine = d3.select(this);
        curLine
            .attr("fill", color(i))
            .selectAll("whatever")
            .data(d => Object.entries(d))
            .enter()
            .append("circle")
            .attr("class", "points")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", "3px")
            .style('pointer-events', 'all')
            .append('title')
            .text(d => `${d[0]}: ${(d[1]*100).toFixed(2)}%`);
    });

    let lineGenerator = d3.line()
	        .x(function(d) {return xScale(d[0])})
            .y(function(d) {return yScale(d[1])});
    lines
        .each(function(d, i) {
        	d3.select(this)
                .attr("stroke", color(i))
                .append("path")
                .datum(
                    sortDataEntry(d, xSort)
                )
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('d', lineGenerator);
        })

/* 
    // Add x-axis label
    svg.append('text')
        .attr('x', width/2)
        .attr('y', height - 15)
        .attr('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .text('Wavelength (nm)');
*/
    // Add y-axis label
    svg.append('text')
        .attr('text-anchor', 'middle')

        .attr('transform', `translate(-40, ${height/2})rotate(-90)`)
        .style("font-size", "12px")
        .style('font-family', 'sans-serif')
        .text('Percentage');

    // Add legend
    svg.append('path')
        .datum([["vanilla", 0.5], ["water", 0.5]])
        .attr('stroke', color(0))
        .attr('stroke-width', 2)
        .attr('d', d3.line()
              .x((d) => xScale(d[0]))
              .y((d) => yScale(d[1])));
    svg.append('path')
        .datum([["vanilla", 0.45], ["water", 0.45]])
        .attr('stroke', color(1))
        .attr('stroke-width', 2)
        .attr('d', d3.line()
              .x((d) => xScale(d[0]))
              .y((d) => yScale(d[1])));

    svg.append('text')
        .attr('x', xScale("water"))
        .attr('y', yScale(0.5))
        .attr('dx', 10)
        .attr('alignment-baseline', 'central')
        .style("font-size", "12px")
        .text('Avg recipe');
    svg.append('text')
        .attr('x', xScale("water"))
        .attr('y', yScale(0.45))
        .attr('dx', 10)
        .attr('alignment-baseline', 'central')
        .style("font-size", "12px")
        .text('Current recipe');
}

function sortDataEntry(entry, order) {
    return Object.entries(entry).sort(
        function(a, b) {
            return order[a[0]] - order[b[0]]
        }
    )
}

function updateToolRow() {
    d3.select("#tool-row").selectAll("div").remove();
    let content = d3.select("#tool-row")
        .append("div")
        .attr("id", "ingd-map");

    let dendro = content.append("div")
        .attr("class", "dendroWrapper"),
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
    const root = d3.hierarchy(ingdMap, function(d) {
        return d.children;
    });
    cluster(root);

    // Add the links between nodes:
    svg.selectAll('path')
    .data( root.descendants().slice(1) )
    .join('path')
    .attr("d", function(d) {
        return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 50) + "," + d.x
                + " " + (d.parent.y + 50) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.y + "," + d.parent.x;
                })
    .style("fill", 'none')
    .attr("stroke", '#ccc')

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
