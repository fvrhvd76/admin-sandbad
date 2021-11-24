<template>
  <v-app dark>
    <div
      style="height:100%"
      class="d-flex flex-column justify-center align-center"
    >
      <img
        src="~/static/images/404.png"
        alt="error"
        :style="
          $vuetify.breakpoint.mdAndUp
            ? 'height:40%; width:50%'
            : 'height:20%; width:50%'
        "
        class="mb-16"
      />
      <h1 style="font-size:80px" class="mb-8" v-if="error.statusCode === 404">
        404
      </h1>
      <h1
        style="$vuetify.breakpoint.mdAndUp ? 'font-size:50px' : 'font-size:20px'"
        class="mb-8"
        v-else
      >
        {{ error.statusCode === 404 ? pageNotFound : otherError }}
      </h1>
      <NuxtLink to="/">
        <v-btn color="primary">بازگشت به صفحه داشبورد</v-btn>
      </NuxtLink>
    </div>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "متاسفانه صفحه مورد نظر پیدا نشد.",
      otherError: "خطایی رخ داده است."
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
