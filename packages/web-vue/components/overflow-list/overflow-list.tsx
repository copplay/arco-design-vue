import { computed, defineComponent, PropType, ref, VNode, watch } from 'vue';
import ResizeObserver from '../_components/resize-observer-v2';
import { getAllElements } from '../_utils/vue-utils';
import { getPrefixCls } from '../_utils/global-config';
import { Size } from '../_utils/constant';
import Tag from '../tag';

export default defineComponent({
  name: 'OverflowList',
  props: {
    /**
     * @zh 最少展示的元素个数
     * @en Minimum number of elements to display
     */
    min: {
      type: Number,
      default: 0,
    },
    /**
     * @zh 尺寸
     * @en Size
     */
    size: {
      type: String as PropType<Size>,
      default: 'small',
    },
  },
  setup(props, { slots }) {
    const prefixCls = getPrefixCls('overflow-list');

    const listRef = ref<HTMLElement>();
    const overflowRef = ref<HTMLElement>();

    const total = ref(0);
    const overflowNumber = ref(0);
    const showOverflow = computed(() => overflowNumber.value > 0);

    watch(showOverflow, () => onResize(), { flush: 'post' });

    const marginWidth = computed(() => {
      switch (props.size) {
        case 'mini':
          return 4;
        case 'medium':
          return 16;
        case 'large':
          return 24;
        default:
          return 8;
      }
    });

    const itemSize: number[] = [];

    const onResize = () => {
      if (listRef.value && children.value) {
        let remainingWidth =
          listRef.value.clientWidth - (overflowRef.value?.offsetWidth ?? 0);
        let count = 0;
        for (let i = 0; i < children.value.length; i++) {
          const element = children.value[i].el as HTMLElement;
          if (element && element.offsetWidth) {
            itemSize[i] = element.offsetWidth + marginWidth.value;
          }
          const itemWidth = itemSize[i] ?? 0;
          if (itemWidth < remainingWidth) {
            remainingWidth -= itemWidth;
            count += 1;
          }
        }
        if (count < props.min) {
          count = props.min;
        }
        if (overflowNumber.value !== total.value - count) {
          overflowNumber.value = total.value - count;
        }
      }
    };

    const renderOverflow = () => {
      return (
        <div ref={overflowRef} class={`${props}-overflow`}>
          <Tag>+{overflowNumber.value}</Tag>
        </div>
      );
    };

    const children: { value?: VNode[] } = {};

    const cls = computed(() => [prefixCls, `${prefixCls}-size-${props.size}`]);

    return () => {
      children.value = getAllElements(slots.default?.());

      if (total.value !== children.value.length) {
        total.value = children.value.length;
      }
      let visibleChildren = children.value;
      if (overflowNumber.value > 0) {
        visibleChildren = children.value.slice(0, -overflowNumber.value);
      }

      return (
        <ResizeObserver onResize={onResize}>
          <div ref={listRef} class={cls.value}>
            {visibleChildren}
            {overflowNumber.value > 0 && renderOverflow()}
          </div>
        </ResizeObserver>
      );
    };
  },
});
