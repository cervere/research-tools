import { ResponsiveRadar } from '@nivo/radar'

const exampleData = [
    {
      "taste": "fruity",
      "chardonay": 91,
      "carmenere": 42,
      "syrah": 21
    },
    {
      "taste": "bitter",
      "chardonay": 60,
      "carmenere": 90,
      "syrah": 20
    },
    {
      "taste": "heavy",
      "chardonay": 76,
      "carmenere": 60,
      "syrah": 86
    },
    {
      "taste": "strong",
      "chardonay": 85,
      "carmenere": 31,
      "syrah": 110
    },
    {
      "taste": "sunny",
      "chardonay": 55,
      "carmenere": 90,
      "syrah": 46
    }
  ]

const featureCol = 'taste';

const dataGroups = Object.keys(exampleData[0]).filter((key) => !(key === featureCol))
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const NivoRadar = ({ data /* see data tab */ }) => (
    <ResponsiveRadar
        data={data}
        keys={Object.keys(data[0]).filter((key) => !(key === 'feature'))}
        indexBy="feature"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)