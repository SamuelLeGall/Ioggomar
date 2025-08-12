import type { DirectiveBinding } from "vue";

type ClickOutsideElement = HTMLElement & {
  clickOutsideEvent?: (event: MouseEvent) => void;
};

export default {
  beforeMount(
    el: ClickOutsideElement,
    binding: DirectiveBinding<(inside: boolean) => void>,
  ) {
    el.clickOutsideEvent = function (event: MouseEvent) {
      // here I check that click was outside the el and his children
      if (!(el === event.target || el.contains(event.target as Node))) {
        // and if it did, call method provided in attribute value
        binding.value(false);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },

  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.body.removeEventListener("click", el.clickOutsideEvent);
    }
  },
};
