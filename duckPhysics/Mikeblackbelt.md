# Feedback – Mike

This is the most ambitious project in the class — a 3D physics simulation using Three.js and the Rapier physics engine inside a Vue app. Clicking "Dave" drops a 3D character model into a physics world. That's genuinely impressive. However, the project is more of a Three.js app hosted inside Vue than a Vue reactivity project, so most Vue-specific rubric items are not used.

## Vite CLI – Mastery
`package.json` correctly lists `vite` and `@vitejs/plugin-vue` as dev dependencies. Production dependencies include `vue`, `three`, and `@dimforge/rapier3d-compat`.

## Iteration in Vue (v-for) – Not Yet
There is no `v-for` anywhere in the project. The 3D scene is built imperatively inside `onMounted`. To hit this requirement, you could iterate over a list of items to add — for example, a list of launch buttons or different characters to drop.

## Data Binding – Approaching
You use `ref(null)` for the container element:
```js
const container = ref(null);
```
And bind it in the template:
```html
<div ref="container" class="scene"></div>
```
This is correct Vue usage. However, there's no reactive data (like a score, a counter, or a list) displayed via `{{ }}` in the template.

## Click Methods – Mastery
The event system between components is well-implemented:
```html
<DaveCard @load-dave="handleLoadDave" />
```
`DaveCard` uses `defineEmits(['load-dave'])` and emits the event on click, which triggers `handleLoadDave()` in `App.vue`. This is the correct Vue component communication pattern.

## Reactive UI – Approaching
Clicking the card does visibly change the scene (Dave appears and falls). However, this is an imperative Three.js update, not Vue's reactivity system. There are no reactive data values (`ref`/`reactive`) being rendered with `{{ }}` that change in response to user input.

## Semantic HTML – Approaching
The template is minimal:
```html
<div ref="container" class="scene"></div>
<DaveCard ... />
```
There's no real HTML structure to evaluate. Adding a `<header>`, a `<main>`, or some descriptive text would help.

## BEM CSS – Not Yet
Only two class names exist: `.scene` and `.card`. Neither follows BEM structure. To apply BEM:
- `.physics-scene` (block)
- `.dave-card` (block)
- `.dave-card__title` (element)
- `.dave-card--active` (modifier)

## Bonus – Aesthetics
The project is visually stunning — a physics-enabled 3D environment that responds to a card click is beyond what most students attempt. The green background with the falling character model is memorable. Major points for creativity.

## Summary of Critical Fixes
- Add at least one `v-for` loop — for example, a list of different models to spawn, or a list of physics objects.
- Display at least one reactive value in the template with `{{ }}` (e.g., a "Daves spawned: {{ count }}" counter).
- Update class names to follow BEM convention: `.dave-card`, `.dave-card__description`, etc.
