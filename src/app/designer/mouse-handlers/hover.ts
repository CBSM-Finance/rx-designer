import { Designer } from '../designer';
import { designerVars } from '../designer-vars';

export class HoverMouseHandler {
  reload() {
    const { mh, glNodes, canvas } = this.designer;

    glNodes.forEach((gl, i) => {
      const core = gl.query('core')[0];
      mh.register(core, {
        onMove: (ev: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const { translate } = designerVars;
          return (core.props.hover =
            core.intersect(
              ev.pageX - rect.x - translate.x,
              ev.pageY - rect.y - translate.y,
            ).length > 0);
        },
      });

      gl.query('in-port')
        .concat(gl.query('out-port'))
        .forEach(port => {
          mh.register(port, {
            onMove: (ev: MouseEvent) => {
              const rect = canvas.getBoundingClientRect();
              const { translate } = designerVars;
              return (port.props.hover =
                port.intersect(
                  ev.pageX - rect.x - translate.x,
                  ev.pageY - rect.y - translate.y,
                ).length > 0);
            },
          });
        });
    });
  }

  constructor(private designer: Designer) {}
}
