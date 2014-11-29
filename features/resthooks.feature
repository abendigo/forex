Feature: Rest Hooks
  In order to interface with Zapier (https://zapier.com)
  We want to implement Rest Hooks (http://resthooks.org)

  Background:
    Given a running server

  Scenario: List Subscriptions (None found)
    Given I have no hooks registered
    When I GET /api/subscription
    Then an Empty List is returned

  Scenario: List Subscriptions (One found)
    Given I have one hook registered
    When I GET /api/subscription
    Then an List containing one entry is returned

  Scenario: List Subscriptions (Multiple found)
    Given I have multiple hooks registered
    When I GET /api/subscription
    Then an List containing multiple entries is returned

  Scenario: Create a Subscription
    When I subscribe to transactions

  Scenario: Get details of a Subscription
    Given I have one hook registered
    When I GET /api/subscription/1
    Then details are returned

  Scenario: Modify details of a Subscription

  Scenario: Delete a Subscription