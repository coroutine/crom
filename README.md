# Crom

A JS library that laughs at your four winds.

![Crom!](http://i811.photobucket.com/albums/zz31/MolochZ/Crom2_380_zps73956dff.jpg)

# Example

## Server Response

Below is our example JSON response from the RESTful API endpoint `http://example.com/snakepits/1.json`:

```json
{
  "depth": 40,
  "units": "meters",
  "owner": {
    "name": "Crom",
    "title": "God of Steel"
  },
  "snakes": [
    {
      "length": "20",
      "units":  "meters",
      "isVenomous": true,
      "likes": "killing the shit out of people."
    },
    {
      "length": "12",
      "units":  "meters",
      "isVenomous": false,
      "likes": "long walks on the beach."
    }
  ]
}
```

## Crom Models

And now, the corresponding Backbone Models, leveraging Crom:

### Person

```coffeescript
class Person extends Crom.Model
  defaults:
    name: null
    title: null
```

### Snake

``` coffeescript
class Snake extends Crom.Model
  defaults:
    length: 0
    units: null
    isVenomous: false
    likes: null
```

### Snakes (_Collection_)

```coffeescript
class Snakes extends Crom.Collection
  model: Snake
```

### Snakepit

```coffeescript
class Snakepit extends Crom.Model

  # our glorious RESTful endpoint
  url: 'http://example.com/snakepits'

  defaults:
    depth: 0
    units: null

  # Here we have some nested data
  nested: ->
    owner:  Person
    snakes: Snakes
```

## Putting it all together

Now we're able to put our models to the test:

```coffeescript
snakepit = new Snakepit(id: 1)
snakepit.fetch()

snakepit.owner # -> an instance of the Person model
snakepit.snakes # -> an instance of the Snakes collection
```
