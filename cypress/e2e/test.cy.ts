describe('Проверка системы авторизации', () => {
  it('Вход и переход в личный кабинет', () => {
    const userDataMock = {
      success: true,
      user: {
        email: 'bombatcat@mail.com',
        name: 'bombatcat'
      }
    };

    cy.intercept('GET', 'api/auth/user', {
      body: userDataMock,
      statusCode: 200
    }).as('fetchUserData');

    cy.visit('/');

    cy.contains('Личный кабинет').click();

    cy.wait('@fetchUserData');

    cy.contains(userDataMock.user.name).then(($el) => {
      cy.wrap($el).click();
    });

    cy.url().should('include', '/profile');

    cy.get('form').should('be.visible');
    cy.get('input[name="name"]').should('have.value', userDataMock.user.name);
  });
});

describe('Тестирование сборки бургера', () => {
  const baseUrl = 'http://localhost:4000';
  const timeoutLimit = 10000;

  const ingredientNames = {
    bun: 'Флюоресцентная булка R2-D3',
    filling: 'Биокотлета из марсианской Магнолии'
  };

  beforeEach(() => {
    cy.fixture('ingredients.json').as('menuData');
    cy.fixture('user.json').as('profileData');

    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('loadIngredients');

    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('loadProfile');

    cy.setCookie('accessToken', 'testToken');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'testToken');
    });

    cy.visit('/');
    cy.contains('Соберите бургер').as('burgerTitle');
    cy.contains('Булки').as('bunSection');
    cy.contains('Начинки').as('fillingSection');
    cy.contains(ingredientNames.bun).as('mainBunItem');
    cy.contains(ingredientNames.filling).as('meatFilling');
    cy.contains('Оформить заказ').as('submitOrderBtn');

    cy.get('@burgerTitle').should('exist', { timeout: timeoutLimit });
  });

  it('Конструктор бургера должен быть пустым', () => {
    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });

  it('Добавление булки в конструктор', () => {
    cy.get('@bunSection').then(($tab) => {
      cy.wrap($tab).scrollIntoView().click({ force: true });
      cy.wrap($tab).parent().should('have.class', 'tab_type_current');
    });

    cy.get('@mainBunItem').then(($el) => {
      cy.wrap($el).next().click({ force: true });
    });

    cy.get('@mainBunItem').should('be.visible', { timeout: timeoutLimit });
  });

  it('Добавление начинки в бургер', () => {
    cy.get('@fillingSection').then(($tab) => {
      cy.wrap($tab).scrollIntoView().click({ force: true });
    });

    cy.get('@meatFilling').next().click();

    cy.get('@meatFilling').should('be.visible');
  });

  it('Создание заказа и его оформление', () => {
    cy.intercept('POST', 'api/orders', {
      fixture: 'orderResponse.json',
      statusCode: 200
    }).as('sendOrder');

    // Добавляем ингредиенты
    cy.get('@mainBunItem').next().click();
    cy.get('@fillingSection').scrollIntoView();
    cy.get('@meatFilling').next().click();

    // Проверяем доступность кнопки
    cy.get('@submitOrderBtn')
      .should(($btn) => {
        expect($btn).to.be.enabled;
      })
      .click();

    // Ожидаем ответа
    cy.wait('@sendOrder', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    // Проверяем модальное окно
    cy.get('[data-testid="modal"]').should('be.visible');

    cy.get('[data-testid="order-number"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.match(/^\d+$/);
      });

    // Закрываем по esc
    cy.get('body').type('{esc}');

    // Проверяем очистку конструктора
    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
      cy.get('[data-testid="constructor-item"]').should('not.exist');
    });
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.contains(ingredientNames.bun).click();
    cy.get('[data-testid="modal"]').should('be.visible');

    cy.contains(ingredientNames.bun).should('exist');

    cy.get('body').type('{esc}');
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Закрытие модального окна кликом вне области', () => {
    cy.contains(ingredientNames.bun).click();
    cy.get('[data-testid="modal"]').should('be.visible');

    cy.get('body').click(10, 10); 

    cy.get('[data-testid="modal"]').should('not.exist');
  });
});