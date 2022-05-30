```yaml
title:
  zh-CN: 基本使用
  en-US: Basic Usage
```

## zh-CN

折叠列表的基本使用方法。

---

## en-US

Basic usage of the overflow-list.

---

```vue

<template>
  <a-slider v-model="width" :min="0" :max="800" />
  <div :style="{width:`${width}px`,marginTop:'20px'}">
    <a-overflow-list>
      <div>Test</div>
      <a-tag v-for="item of tags" :key="item">Tag{{item}}</a-tag>
    </a-overflow-list>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const width = ref(500)
    const tags = Array(10).fill(undefined).map((_, index) => index + 1)

    return {
      width,
      tags
    }
  }
}
</script>
```
