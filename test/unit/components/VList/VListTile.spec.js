import { test } from '@/test'
import { VListTile } from '@/components/VList'
import { compileToFunctions } from 'vue-template-compiler'
import Vue from 'vue/dist/vue.common'

const stub = {
  name: 'router-link',
  render: h => h('button')
}

test('VListTile.vue', ({ mount }) => {
  it('should render with a div when inactive is true and href is used', () => {
    const wrapper = mount(VListTile, {
      propsData: {
        href: 'http://www.google.com',
        inactive: true
      }
    })

    expect(wrapper.is('div')).toBe(true)
    expect(wrapper.findAll('div')).toHaveLength(2)
    expect(wrapper.findAll('a')).toHaveLength(0)
    expect(wrapper.findAll('.v-list__tile--link')).toHaveLength(0)
  })

  it('should render with a tag when tag is specified', () => {
    const wrapper = mount(VListTile, {
      propsData: {
        tag: 'code'
      }
    })

    expect(wrapper.is('div')).toBe(true)
    expect(wrapper.findAll('code')).toHaveLength(1)
  })

  it('should render with a div when href and to are not used', () => {
    const wrapper = mount(VListTile)

    expect(wrapper.is('div')).toBe(true)
    expect(wrapper.findAll('div')).toHaveLength(2)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render <div> with <a> when using href prop', () => {
    const wrapper = mount(VListTile, {
      propsData: {
        href: 'http://www.google.com'
      }
    })

    const a = wrapper.find('a')

    expect(wrapper.is('div')).toBe(true)
    expect(a.attributes()['href']).toBe('http://www.google.com')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render <div> with <button> when using to prop', () => {
    const instance = Vue.extend()
    instance.component('router-link', stub)

    const wrapper = mount(VListTile, {
      propsData: {
        to: '/home'
      },
      instance
    })

    expect(wrapper.is('div')).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not have activeClass when not toggled', () => {
    const wrapper = mount(VListTile, {
      propsData: {
        href: 'http://www.google.com'
      }
    })

    const link = wrapper.find('a')
    expect(link.classes()).not.toContain(wrapper.instance().activeClass)
  })

  it('should have activeClass when toggled', () => {
    const wrapper = mount(VListTile, {
      propsData: {
        href: 'http://www.google.com',
        value: true
      }
    })

    const link = wrapper.find('a')
    expect(link.classes()).toContain(wrapper.instance().activeClass)
  })

  it('should have --link class when href prop present', () => {
    const wrapper = mount(VListTile, {
      propsData: {
        href: '/home'
      }
    })

    expect(wrapper.contains('.v-list__tile--link')).toBe(true)
  })

  it('should have --link class when to prop present', () => {
    const instance = Vue.extend()
    instance.component('router-link', stub)

    const wrapper = mount(VListTile, {
      propsData: {
        to: '/home'
      },
      instance
    })

    expect(wrapper.contains('.v-list__tile--link')).toBe(true)
  })

  it('should have --link class when click handler present', () => {
    const { render } = compileToFunctions(`
      <v-list-tile @click="">Test</v-list-tile>
    `)

    const component = Vue.component('test', {
      components: {
        VListTile
      },
      render
    })

    const wrapper = mount(component)

    expect(wrapper.contains('.v-list__tile--link')).toBe(true)
  })

  it('should have --link class when click.prevent.stop handler present', () => {
    const { render } = compileToFunctions(`
      <v-list-tile @click.prevent.stop="">Test</v-list-tile>
    `)

    const component = Vue.component('test', {
      components: {
        VListTile
      },
      render
    })

    const wrapper = mount(component)

    expect(wrapper.contains('.v-list__tile--link')).toBe(true)
  })
})
