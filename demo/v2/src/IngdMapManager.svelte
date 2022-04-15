<script>
    import { ingdMap } from './stores';
    import IngdTree from './IngdTree.svelte';
    const valueInit = 
`{
    "name": "",
    "children": [
        {"name": "sweentener", "children": ["white sugar", "brown sugar"]},
        {"name": "leavener", "children": ["baking soda", "baking powder"]}
    ]
}`;
    let valueInput;
    reset();

    function update() {
        try {
            ingdMap.update(d => JSON.parse(valueInput));
        } catch (e) {
            alert(e);
        }
    }

    function reset() {
        valueInput = valueInit;
        ingdMap.update(d => JSON.parse(valueInput));
    }
</script>

<IngdTree/>
<div>
    <p>Update ingredient mapping relationship:</p>
    <button on:click={update}>Submit</button>
    <button on:click={reset}>Reset</button>
    <textarea bind:value={valueInput}></textarea>
</div>
<style>
    textarea {
        width: 97%;
        height: 180px;
    }
    p, button {
        display: inline;
        margin: 10px 3px 10px 0px;
    }
    p {
        font-size: var(--font-size-small);
    }
</style>
