<template lang="pug">
post-query(:tag="tagName" :defaults="defaults")
</template>

<script lang="ts">
import PostQuery from "@/components/PostQuery.vue";
import { Vue, Component } from "nuxt-property-decorator";
import htmlToText from "html-to-text";
import { axiosOrImport, config } from "../../assets/util";
import { teaserStore } from "../../store";

@Component({
  components: {
    PostQuery
  }
})
export default class TagPage extends Vue {
  title = config.title;
  header?: any;
  tagName = "";

  async asyncData({ $axios, $payloadURL, route, params }: any) {
    if(process.static && process.client && $payloadURL) {
      return await $axios.$get($payloadURL(route))
    }

    const { tagName } = params;
    const now = new Date().toISOString();

    const ps: any[] = (await axiosOrImport(`/build/json/headers.json?h=${config.h}`)).filter((h: any) => {
      return (h.tag || []).map((t: string) => t.toLocaleLowerCase()).includes(tagName.toLocaleLowerCase()) &&
      h.date && h.date <= now;
    });

    const posts = await Promise.all(ps.slice(0, config.posts.perPage).map(async (p) => {
      p.teaser = await teaserStore.get(p.path, p.h);
      return p;
    }));

    const data: any = {
      defaults: {
        posts,
        count: ps.length
      },
      tagName: tagName
    };

    if (posts[0]) {
      Object.assign(data, {
        header: posts[0],
      });
    }

    return data;
  }

  head() {
    const { header, tagName } = this;

    if (header) {
      const metaImage = header.image;
      const description = htmlToText.fromString(header.teaser);

      const title = `Tag: ${tagName} - ${this.title}`;

      return {
        title,
        meta: [
          {
            hid: "description",
            name: "description",
            content: description
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: title
          },
          {
            hid: `og:description`,
            property: 'og:description',
            content: description
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: metaImage
          },
          {
            hid: 'twitter:title',
            property: 'twitter:title',
            content: title
          },
          {
            hid: 'twitter:description',
            property: 'twitter:description',
            content: description
          },
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: metaImage
          },
        ]
      }
    }

    return {};
  }
}
</script>
