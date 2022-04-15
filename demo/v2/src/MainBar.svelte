<script>
    import * as d3 from 'd3';
    import { ingdMap } from './stores';
    import { unravel, sortIngd } from './helper.svelte';
    import Bar from './Bar.svelte';
    import MainDendro from './MainDendro.svelte';

    const rectHeight = 23,
        xAccessor = d => +d[1],
        yAccessor = d => d[0],
        margin = {"left": 140, "top": 20};

    let ingdMapLocal,
        yDomain, xTrans, yTrans,
        svgWidth = 400,
        width = svgWidth - margin.left,
        height = 500;

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

    $: {
        width = svgWidth - margin.left;
        height = rectHeight * data.map(yAccessor).length;

        let { maxDepth, ingdMapLayer } = unravel(ingdMapLocal);

        if (Object.entries(ingdMapLayer).length !== 0) {
            yDomain = sortIngd(data.map(yAccessor), ingdMapLayer[2]);
        } else {
            yDomain = data.map(yAccessor);
        }
        xTrans = d3.scaleLinear()
            .domain([0, 0.5])
            .range([0, width]);
        yTrans = d3.scaleBand()
            .domain(yDomain)
            .range([0, height])
            .padding(.1);
    }
</script>

<div bind:clientWidth={svgWidth}>
    <svg width={svgWidth} {height}>
        <g class="bar-container"
             style="transform: translate({margin.left}px, {margin.top}px);">
            <Bar
                {data} {xAccessor} {yAccessor} {xTrans} {yTrans}
                    barOpacity={0.5}
            />
        </g>
        <g class="dendro-container"
             style="transform: translate({margin.left-3}px, {margin.top+rectHeight/2}px);">
            <MainDendro
                    {ingdMapLocal}
                    bind:yTrans={yTrans}
                    gapX={30}
                    nodeColor={"cadetblue"}
                    pathColor={"#efefef"}
                    nodeSize={3}
                    nodeOpacityDefault={0.35},
                    nodeOpacityHover={0.75}
            />
        </g>
    </svg>
</div>
