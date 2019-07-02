<template>
  <section class="cat">
    <div class="category-section" v-if="category !== null">
      <h4 class="text-gray">{{category.title}}</h4>
      <div class="category-list">
        <div class="category-link" v-for="(cat,i) in category.catList" :key="i">
          <router-link :to="{ name: 'CatList', params: { major: cat.name}, query: { gender: category.gender} }">
            <span class="name">{{cat.name}}</span>
            <span class="count">{{cat.bookCount}}本</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: "Cat",
    props: {
      category: {type: Object, required: true}
    },
    data(){
      return{

      }
    }
  }
</script>

<style scoped lang="scss">
  .category-section {
    h4 {
      padding: 0 0.4rem;
      height: 1.6rem;
      line-height: 1.6rem;
      font-weight: 400;
    }
  }

  .category-list {
    display: flex;
    justify-content:flex-start;
    align-items: center;
    flex-wrap: wrap;

    .category-link {
      display: inline-block;
      vertical-align: middle;
      width: 33%;
      padding: .26667rem;
      text-align: center;
      border-top: 1px solid #f8f8f8;
      border-right: 1px solid #f8f8f8;
      border-bottom: 1px solid #f8f8f8;

      &:nth-child(3n+3) {
        width: 34%;
        border-right: none;
      }

      .name {
        display: block;
        line-height: 2rem;
        font-size: 0.8rem;
        font-weight: 700;
        color: #333;
      }

      .count {
        display: block;
        line-height: 1rem;
        font-size: 0.75rem;
        color: #ccc;
      }
    }

  }
</style>
