<script>
    import * as d3 from 'd3';
    import MainVis from './MainVis.svelte';
    import IngdMapManager from './IngdMapManager.svelte';
    import { recipeSelected } from './stores.js';

    async function loadData() {
        return await d3.csv("https://gist.githubusercontent.com/longyyu/d0bba5e9f7f6bd6e523382019137153b/raw/a5cc86a0bef4194cefc73a562520ab99270fa069/demo-ccc-recipes.csv");
    }
    let promise = loadData();

    function showRecipe(datum) {
        const detailBox = d3.select("#detail-box");
        detailBox.selectAll("div").remove();
        let content = detailBox.append("div")
            .attr("id", "recipe-box")
            .style("font-size", "var(--font-size-small)");
        content.append("p").html(`#${datum.recipe_id}: ${datum.title}`);
        content
            .append("ul")
            .attr("class", "ingd-list")
            .selectAll("li")
            .data(datum.ingredients.split("^"))
            .enter()
            .append("li")
            .html(v => v);
        content.append("button")
            .attr("onclick", `window.open('https://${datum.link}', '_blank')`)
            .text("Original recipe");
    }

    const recipeSelectedInit = {"recipe_id": -1};
    recipeSelected.set(recipeSelectedInit);
    recipeSelected.subscribe((v) => {
        if (v.recipe_id !== -1) {
            showRecipe(v);
            // drawLine([avgRecipe, getRecipeIngd(data, selectedRecipeId)], content);
        }
    })
</script>

<div class="dashboard">
    <div class="col-1">
        <div class="title-box">
            <h1>Chocolate chip cookies</h1>
            <div id="wiki-info">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2ChocolateChipCookies.jpg/330px-2ChocolateChipCookies.jpg" alt="">
                <p id="description">
                    A chocolate chip cookie is a drop cookie that features chocolate chips or chocolate morsels as its distinguishing ingredient.
                    Generally, the recipe starts with a dough composed of flour, butter, both brown and white sugar, semi-sweet chocolate chips, eggs, and vanilla. Variations on the recipe may add other types of chocolate, as well as additional ingredients such as nuts or oatmeal. There are also vegan versions with the necessary ingredient substitutions, such as vegan chocolate chips, vegan margarine, and egg substitutes. 
                </p>
            </div>
        </div>
        <ul class="todo">
            <li>Collapse columns to show ingredient summ stats (frequencies, avg pct)</li>
            <li>Drag and drop to reorder rows/columns</li>
            <li>Order column and set color by ingredient groups</li>
        </ul>
        {#await promise}
            <p>...loading...</p>
        {:then data}
            <MainVis {data}/>
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </div>
    <div class="col-2">
        <div id="details-view">
            <h2>Recipe details</h2>
            <ul class="todo">
                <li>Show recipe details when user clicks on a cell; can choose and compare multiple recipes</li>
                <li>Show ingredient summ stats when user clicks on an ingredient (either on y-axis or on a term in the wiki paragraph); can choose multiple ingredients (upsetplot)</li>
            </ul>
            <div id="detail-box" style="min-height:400px;"></div>
        </div>
        <div id="tool-row">
            <h2>Ingredient aggregation</h2>
            <ul class="todo">
                <!-- <li><a href="https://embed.plnkr.co/pCE9Ih/" target="_blank">drag and drop</a> to update the mapping relationship</li> -->
            </ul>
            <IngdMapManager/>
        </div>
        <div id="tool-col">
            <h2>Recipe selection</h2>
            <ul class="todo">
                <li>query keyword to filter recipes</li>
            </ul>
        </div>
    </div>
    
</div>
