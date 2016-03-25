'use strict';

const p = {
  // Private properties.
  settings: Symbol('settings'),
  net: Symbol('net')
};

export default class Recipe {
  constructor(props) {
    this[p.settings] = props.settings;
    this[p.net] = props.net;
  }

  /**
   * Returns a promise resolving to a list of recipes.
   *
   * @return {Promise}
   */
  getAll() {
    return this[p.net].fetchJSON(`${this[p.net].origin}/api/v${this[p.settings].apiVersion}/services`)
      // Get all recipes.
      .then(services => services.filter(service =>
        service.adapter === 'thinkerbell-adapter' &&
        service.id !== 'thinkerbell-root-service'
      ))
      // Fetch their respective enabled status.
      .then(recipes => {
        const promises = recipes.map(recipe => {
          const payload = [
            { id: `${recipe.id}/get_enabled` }
          ];

          return this[p.net].fetchJSON(`${this[p.net].origin}/api/v${this[p.settings].apiVersion}/channels/get`,
            'PUT',
            payload);
        });

        return Promise.all(promises)
          .then(servicesEnabled => {
            return servicesEnabled;
          })
          // Map all the recipes to a more user-friendly format.
          .then(servicesEnabled => recipes.map((recipe, id) => ({
            id: recipe.id,
            name: recipe.id,
            enabled: servicesEnabled[id][`${recipe.id}/get_enabled`] === 'On'
          })))
          .then(services => {
            console.log(services);
            return services;
          });
      });
  }

  /**
   * Create a new recipe.
   *
   * @return {Promise}
   */
  add() {
    const recipe = {
      'rules': [
        {
          'conditions': [
            {
              'source': [
                {
                  'kind': 'CurrentTimeOfDay'
                }
              ],
              'kind': 'CurrentTimeOfDay',
              'range': {
                'Geq': {
                  'Duration': 5
                }
              }
            },
            {
              'source': [
                {
                  'kind': 'CurrentTimeOfDay'
                }
              ],
              'kind': 'CurrentTimeOfDay',
              'range': {
                'Leq': {
                  'Duration': 2
                }
              }
            }
          ],
          'execute': [
            {
              'destination': [
                {
                  'kind': 'Ready'
                }
              ],
              'value': {
                'Unit': []
              },
              'kind': 'Ready'
            }
          ]
        }
      ]
    };

    return this[p.net].fetchJSON(`${this[p.net].origin}/api/v${this[p.settings].apiVersion}/channels/set`,
      'PUT',
      [
        [
          [
            { id: 'thinkerbell-add-rule' }
          ],
          {
            ThinkerbellRule: {
              name: 'foo',
              source: JSON.stringify(recipe)
            }
          }
        ]
      ]);
  }

  /**
   * Remove a recipe with the associated id.
   *
   * @param {string} id
   * @return {Promise}
   */
  remove(id) {
    return this[p.net].fetchJSON(`${this[p.net].origin}/api/v${this[p.settings].apiVersion}/channels/set`,
      'PUT',
      [
        [
          [
            { id: `${id}/remove` }
          ],
          null
        ]
      ]);
  }

  /**
   * Enable or disable the specified recipe.
   *
   * @param {string} id
   * @param {boolean=} value Whether to enable or disable. Enable by default.
   * @return {Promise}
   */
  toggle(id, value = true) {
    const textValue = value ? 'On' : 'Off';
    return this[p.net].fetchJSON(`${this[p.net].origin}/api/v${this[p.settings].apiVersion}/channels/set`,
      'PUT',
      [
        [
          [
            { id: `${id}/set_enabled` }
          ],
          {
            OnOff: textValue
          }
        ]
      ]);
  }
}
