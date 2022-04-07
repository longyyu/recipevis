<script>
	import MainBar from './MainBar.svelte';
	import MainTile from './MainTile.svelte';
	import IngdMapManager from './IngdMapManager.svelte';
	let mainVisAggr = 1;
	function toggle() {
		mainVisAggr = 1 - mainVisAggr;
	}
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
		<div id="main-viz"></div>
		<ul class="todo">
			<li>Collapse columns to show ingredient summ stats (frequencies, avg pct)</li>
			<li>Drag and drop to reorder rows/columns</li>
			<li>Order column and set color by ingredient groups</li>
			{#if mainVisAggr}
				<button on:click={toggle}>Individual Recipe View</button>
				<MainBar/>
			{:else}
				<button on:click={toggle}>Aggregated View</button>
				<MainTile/>
			{/if}
		</ul>
	</div>
	<div class="col-2">
		<div id="details-view">
			<h2>Recipe details</h2>
			<ul class="todo">
				<li>Show recipe details when user clicks on a cell; can choose and compare multiple recipes</li>
				<li>Show ingredient summ stats when user clicks on an ingredient (either on y-axis or on a term in the wiki paragraph); can choose multiple ingredients (upsetplot)</li>
			</ul>
			<div id="recipe-box"></div>
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

<style>
	button {
		padding: 5px;
		font-size: var(--font-size-small);
	}
</style>