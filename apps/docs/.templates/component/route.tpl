        {
          path: '/$T{f|componentName}',
          label: '$T{F|componentName}',
          element: createLazyComponent(
            () => import('@/docs/components/$T{f|componentName}.mdx')
          ),
        },