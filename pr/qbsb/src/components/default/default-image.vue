<template>
  <div class="image">
    <div>
      <img :src="!url ? '' : url" :onerror="image_error">
    </div>
  </div>
</template>

<script>
export default {
  props: ["url"],
  data() {
    return {
      image_error: 'this.src="' + require('../../images/default_img.png') + '"',
    }
  }
}
</script>

