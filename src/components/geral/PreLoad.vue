<template>
  <div class="preload">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
  </div>
</template>

<script>
export default {
    name: "PreLoad"
}
</script>

<style scoped>
.preload {
    text-align: center;
}
.preload span {
    background: #1919c7;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
    margin: 4px;
    animation: customAnimation .6s cubic-bezier(0.6,0.1,1,0.4) infinite alternate;
}

.preload span:nth-child(1) { animation-delay: 0.1s; }
.preload span:nth-child(2) { animation-delay: 0.2s; }
.preload span:nth-child(3) { animation-delay: 0.3s; }
.preload span:nth-child(4) { animation-delay: 0.4s; }

@keyframes customAnimation {
    from {
        transform: translate3d(0,0,0)
    }
    to {
        transform: translate3d(0,20px,0)
    }
}

</style>