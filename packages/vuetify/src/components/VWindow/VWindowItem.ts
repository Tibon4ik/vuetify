// Components
import VWindow from './VWindow'

// Mixins
import Bootable from '../../mixins/bootable'
import { factory as GroupableFactory } from '../../mixins/groupable'

// Directives
import Touch from '../../directives/touch'

// Utilities
import { convertToUnit } from '../../util/helpers'
import { ExtractVue } from './../../util/mixins'
import mixins from '../../util/mixins'

// Types
import Vue from 'vue'
import { VNode, VNodeDirective } from 'vue/types'

type VBaseWindow = InstanceType<typeof VWindow>

interface options extends Vue {
  windowGroup: VBaseWindow
}

export default mixins<options & ExtractVue<[typeof Bootable]>>(
  Bootable,
  GroupableFactory('windowGroup', 'v-window-item', 'v-window')
  /* @vue/component */
).extend({
  name: 'v-window-item',

  directives: {
    Touch
  },

  props: {
    reverseTransition: {
      type: [Boolean, String],
      default: undefined
    },
    transition: {
      type: [Boolean, String],
      default: undefined
    },
    value: {
      required: false
    }
  },

  data () {
    return {
      done: null as null | (() => void),
      isActive: false,
      wasCancelled: false
    }
  },

  computed: {
    computedTransition (): string | boolean {
      if (!this.windowGroup.internalReverse) {
        return typeof this.transition !== 'undefined'
          ? this.transition || ''
          : this.windowGroup.computedTransition
      }

      return typeof this.reverseTransition !== 'undefined'
        ? this.reverseTransition || ''
        : this.windowGroup.computedTransition
    }
  },

  mounted () {
    this.$el.addEventListener('transitionend', this.onTransitionEnd, false)
  },

  beforeDestroy () {
    this.$el.removeEventListener('transitionend', this.onTransitionEnd, false)
  },

  methods: {
    genDefaultSlot () {
      return this.$slots.default
    },
    onAfterEnter () {
      if (this.wasCancelled) {
        this.wasCancelled = false
        return
      }

      requestAnimationFrame(() => {
        this.windowGroup.internalHeight = undefined
        this.windowGroup.isActive = false
      })
    },
    onBeforeEnter () {
      this.windowGroup.isActive = true
    },
    onLeave (el: HTMLElement) {
      this.windowGroup.internalHeight = convertToUnit(el.clientHeight)
    },
    onEnterCancelled () {
      this.wasCancelled = true
    },
    onEnter (el: HTMLElement, done: () => void) {
      this.done = done

      requestAnimationFrame(() => {
        this.windowGroup.internalHeight = convertToUnit(el.clientHeight)
      })
    },
    onTransitionEnd (e: TransitionEvent) {
      // This ensures we only call done
      // when the element transform
      // completes
      if (
        e.propertyName !== 'transform' ||
        e.target !== this.$el ||
        !this.done
      ) return

      this.done()
      this.done = null
    }
  },

  render (h): VNode {
    const div = h('div', {
      staticClass: 'v-window-item',
      directives: [{
        name: 'show',
        value: this.isActive
      }] as VNodeDirective[],
      on: this.$listeners
    }, this.showLazyContent(this.genDefaultSlot()))

    return h('transition', {
      props: {
        name: this.computedTransition
      },
      on: {
        afterEnter: this.onAfterEnter,
        beforeEnter: this.onBeforeEnter,
        leave: this.onLeave,
        enter: this.onEnter,
        enterCancelled: this.onEnterCancelled
      }
    }, [div])
  }
})
