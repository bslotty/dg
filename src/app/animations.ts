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
    style({ opacity: 0, overflow: "hidden", /*  height: 0 ,*/ position: "relative", /* border: "1px solid #FF00FF" */}),
    animate('.3s ease',
      style({ offset: 1, opacity: 1, /* height: "*" */ })
    ),
  ]),
  transition(':leave', [
    animate('.3s ease',
      style({
        opacity: 0,
        height: 0
      })
    )
  ]),

])




/*


export const flyInPanelRow = trigger('flyInPanelRow', [
  transition(':enter', [
    style({ opacity: 0, overflow: "hidden" }),
    animate('.3s ease',
      keyframes([
        style({ offset: 0.8, transform: "translateY(5em)", height: 0 }),
        style({ offset: 1, transform: "translateY(0)", opacity: 1, height: "*" })
      ]),
    ),
  ]),
  transition(':leave', [
    animate('.1s ease',
      style({
        opacity: 0,
        transform: "translateY(9em)",
        height: 0
      })
    )
  ])
])
*/