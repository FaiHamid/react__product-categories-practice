/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function findCategory(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId);
}

function findUser(ownerId) {
  return usersFromServer.find(user => user.id === ownerId);
}

const products = productsFromServer.map(product => {
  const category = findCategory(product.categoryId);
  const user = findUser(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

function getVisibleProducts(goods, selectedUser, byQuery) {
  let preparedProducts = [...goods];

  if (selectedUser) {
    preparedProducts = preparedProducts.filter(
      ({ user }) => user.name === selectedUser,
    );
  }

  if (byQuery) {
    preparedProducts = preparedProducts.filter(({ name }) =>
      name.toLowerCase().includes(byQuery.toLowerCase()),
    );
  }

  return preparedProducts;
}

export const App = () => {
  const [choosenUser, setChoosenUser] = useState('');
  const [query, setQuery] = useState('');
  const visibleProducts = getVisibleProducts(products, choosenUser, query);

  function clearQuery() {
    setQuery('');
  }

  function reset() {
    setChoosenUser('');
    setQuery('');
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': choosenUser === '' })}
                onClick={() => setChoosenUser('')}
              >
                All
              </a>

              {usersFromServer.map(({ id, name }) => (
                <a
                  key={id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': choosenUser === name })}
                  onClick={() => setChoosenUser(name)}
                >
                  {name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearQuery}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}

              {/* <a
              data-cy="Category"
              className="button mr-2 my-1 is-info"
              href="#/"
            >
              Category 1
            </a>

            <a data-cy="Category" className="button mr-2 my-1" href="#/">
              Category 2
            </a>

            <a
              data-cy="Category"
              className="button mr-2 my-1 is-info"
              href="#/"
            >
              Category 3
            </a>
            <a data-cy="Category" className="button mr-2 my-1" href="#/">
              Category 4
            </a> */}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              {' '}
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(
                  ({ id, name, category: { title, icon }, user }) => (
                    <tr key={id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">
                        {icon} - {title}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={
                          user.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                        }
                      >
                        {user.name}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
