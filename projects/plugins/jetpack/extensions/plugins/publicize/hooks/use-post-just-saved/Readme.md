# usePostJustSaved() hook
React hook to detect when the post is just saved.
It will run the callback when the post is just saved.
Also, it accepts a dependency array passed to useEffect hook.

```es6
import usePostJustSave from '../../hooks/use-post-just-saved';

function SavingPostLabel() {
	usePostJustSave( function() {
		console.log( 'The post has been saved!' );
	} );
}
```
