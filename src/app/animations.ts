import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  group,
  keyframes,
  animateChild,
  stagger
} from '@angular/animations';

export const fade = trigger('fade', [
  transition('* <=> *', [
    query(':enter', style({
      opacity: 0,
      height: 0,
    }), { optional: true }), animateChild(),

    group([
      query(':leave', animate('.1s ease', style({
        opacity: 0,
        height: 0,
      })), { optional: true }),
      query(':enter', animate('.3s ease', style({
        opacity: 1,
        height: "*",
      })), { optional: true }), animateChild()
    ]),
  ])
]);

export const loading = trigger('loading', [

  //  Visible
  state('1', style({
    opacity: 1,
  })),

  //  Hidden
  state('0', style({
    opacity: 0,
  })),

  //  Transitions
  transition('1 => 0', animate('3s ease')),
  transition('0 => 1', animate('3s ease')),
]);


export const flyIn = trigger('flyIn', [
  transition('* <=> *', [
    query(':enter',
      style({
        opacity: 0,
        transform: "translateY(9em)",
        position: 'relative',
      }),
      { optional: true }),

    group([
      query(':leave', [
        stagger(1000, [
          animate('.1s ease',
            style({
              opacity: 0,
              transform: "translateY(9em)"
            })
          ),
        ])
      ], { optional: true }),
      query(':enter',
        stagger(1000, [
          animate('.3s ease',
            keyframes([
              style({ transform: "translateY(5em)", opacity: 1, }),
              style({ transform: "translateY(.2em)" })
            ]),
          )]
        ), { optional: true })
    ])
  ])
]);


export const scorecardSlide = trigger('scorecardSlide', [
  transition(':increment', [
      style({
      transform: 'translateX(1em)', opacity: 0,
    }),
    animate('0.3s ease-out', style({transform: 'translateX(0)', opacity: 1,}))
  ]), 
  transition(':decrement', [
      style({
      transform: 'translateX(-1em)', opacity: 0,
    }),
    animate('0.3s ease-out', style({transform: 'translateX(0)', opacity: 1,}))
  ])
  /*
  transition(':increment', group([
    query(':enter', [
      style({
        transform: 'translateX(3em)'
      }),
      animate('0.5s ease-out', style({transform: 'translateX(0)'}))
    ], { optional: true }),
    query(':leave', [
      animate('0.5s ease-out', style({
        transform: 'translateX(-3em)'
      }))
    ], { optional: true })
  ])),
  transition(':decrement', group([
    query(':enter', [
      style({
        transform: 'translateX(-3em)'
      }),
      animate('0.5s ease-out', style({transform: 'translateX(0)'}))
    ], { optional: true }),
    query(':leave', [
      animate('0.5s ease-out', style({
        transform: 'translateX(3em)'
      }))
    ], { optional: true })
  ]))
  */
]);



/*  Failed Stagger attempt; unused
export const flyInPanelRow = trigger('flyInPanelRow', [
  transition(':enter', [
    query('.panel',
      stagger(-300,
        animate('.3s ease',
          keyframes([
            style({ transform: "translateY(5em)", opacity: 1, }),
            style({ transform: "translateY(.2em)" })
          ]),
        )
      ), { optional: true }),

  ])
]);
*/

export const flyInPanelRow = trigger('flyInPanelRow', [
  transition(':enter', [
    style({ opacity: 0, overflow: "hidden",   height: 0 , position: "relative", transform: "translateY(-2%)" /* border: "1px solid #FF00FF" */}),
    animate('.3s ease',
      style({ offset: 1, opacity: 1,  height: "*", transform: "translateY(0)"  })
    ),
  ]),
  transition(':leave', [
    animate('.1s ease',
      style({
        opacity: 0,
        /* height: 0 */
        transform: "translateY(-2%)"
      })
    )
  ]),

])



//  PUTT Animation for panel entry: 
//    In:  Slow Raise Up From Bottom-85% -> bounceAbove -> Fast Down to normal POS.
//    Out: Rotate to and fall off 











//  Generic Animations for Chaining
export const growHeight = trigger('fallOut', [
  transition(':enter', [
    style({ overflow: "hidden",  height: 0, position: 'relative' }),
    animate('.3s ease',
      style({ offset: 1, height: "*" })
    ),
  ]),
  transition(':leave', [
    animate('.1s ease',
      style({
        height: 0
      })
    )
  ]),

]);

export const fall = trigger('fall', [
  transition(':enter', [
    style({ opacity: 0, transform: "scale(1.5)", position: 'relative'}),
    animate('1s ease',
      style({ offset: 1, transform: "scale(1)"  })
    ),
  ]),
  transition(':leave', [
    animate('1s ease',
      style({ opacity: 0, transform: "scale(.5)" })
    )
  ]),

]);