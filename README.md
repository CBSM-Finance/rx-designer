# Rx Designer

![Rx Designer Preview](preview.png "Rx Designer Preview")

Rx Designer is a standalone UI for testing and publishing Stock Market Strategies using RxJS.

# Node Repository
## Interactive Brokers
Rx Designer integrates the [Interactive Brokers API](https://interactivebrokers.github.io/tws-api/namespaceIBApi.html) in conjunction with [IB Connector](https://github.com/CBSM-Finance/ib-connector), a bridge for the official C# API. Either IB Gateway or the TWS Client is required for running Strategies.

- **Launch IB** starts IB Connector.
- **Connect TWS** connects IB Connector to the IB Gateway (recommended) or the TWS Client.
- **Request Market Data**
- **Transmit Order**

## KNIME
The [KNIME](https://www.knime.com/) integration allows headless operation of workflows without relying on commercial offers.

## Math
Everything that has to do with numbers and calculations.

- **If** checks if one or more values fulfill a certain criteria.
- **Number** provides a static number.
- **Is Even** checks if a number is even.

## System


- **Connector** connects a chain of observables. This node is always required.
- **Text** provides a static string.
- **Print** writes a text with a given interpolation to the logs.
- **Merge** merges multiple inputs into one stream.
- 

