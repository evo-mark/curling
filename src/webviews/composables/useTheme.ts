import { type Ref, watch, ref, MaybeRefOrGetter } from "vue";

export const useTheme = (source: MaybeRefOrGetter) => {
  watch(
    source,
    (v) => {
      document.documentElement.classList.toggle("dark", v);
    },
    {
      immediate: true,
    }
  );
};
