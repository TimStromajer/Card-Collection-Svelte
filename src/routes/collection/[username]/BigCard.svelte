<script>
// @ts-nocheck
  import { mouseCoordinates } from "../../../stores/userInfo";

  export let card;

</script>

<div class="big-card" style="--mousex: {$mouseCoordinates.y + 1}px; --mousey: {$mouseCoordinates.x + 1}px">
  <img src={card.imgNUsrl} alt={card.name}/>
</div>

<style>
  .big-card {
    top: var(--mousex);
    left: var(--mousey);
    position: fixed;
    aspect-ratio: 2.5 / 3.5;
    width: 300px;
  }
  img {
    height: 100%;
    width: 100%;
  }
</style>