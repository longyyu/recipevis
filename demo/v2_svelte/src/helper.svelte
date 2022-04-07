<script context="module">
	export function unravel(input) {
		// traverse input (ingredient map) using BFS
		// can also make use of `root.descendants()`
		if (Object.entries(input).length === 0) {
			return {"maxDepth": -1, "ingdMapLayer": {}};
		}
		let curDepth = 0,
			results = {0: [input.name]},
			tovisit = [input];
		if (input.children === undefined) {
			return {"maxDepth": 0, "ingdMapLayer": results};
		}

		while (tovisit.length) {
			curDepth += 1;
			let numNodes = tovisit.length,
					nextLevelNodes = [];
			tovisit.forEach((head) => {
				if (head.children != undefined) {
					let childNodes = head.children.map(d => d.name === undefined? d : d.name);
					if (curDepth in results) {
						results[curDepth].push(...childNodes);
					} else {
						results[curDepth] = childNodes;
					} // if (curDepth in results)
					nextLevelNodes = [...nextLevelNodes, ...head.children]; 
				} // if (head.children != undefined)
			}); // forEach
			tovisit = [...tovisit.slice(numNodes), ...nextLevelNodes];
		} // while
		return {"maxDepth": curDepth - 1, "ingdMapLayer": results};
	} // unravel()

	export function sortIngd(toSort, helperArr) {
		return toSort.sort(function(a, b) {
			let pa = helperArr.indexOf(a), pb = helperArr.indexOf(b);
			if (pa === -1 && pb === -1) {
				// none of the two are in ingdMap, keep order
				return 0;
			} else if (pa === -1) {
				// b is in ingdMap, a is not: put b first
				return 1;
			} else if (pb === -1) {
				// a is in ingdMap, b is not: put a first
				return -1;
			}
			// both in ingdMap (pa !== -1 && pb !== -1),
			// sort according to position in ingdMap
			return pa - pb;
		})
	} // sortIngd()
</script>
