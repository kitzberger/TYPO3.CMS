.. include:: /Includes.rst.txt

.. _feature-103578-1712678936:

=========================================================================================
Feature: #103578 - Add database default value support for TEXT, BLOB and JSON field types
=========================================================================================

See :issue:`103578`

Description
===========

Database default values for :sql:`TEXT`, :sql:`JSON` and :sql:`BLOB` fields
could not be used in a cross database vendor compatible manner, for
example in :file:`ext_tables.sql` or as default database scheme generation
for TCA managed tables and types.

Direct default values are still unsupported, but since
`MySQL 8.0.13+ <https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-13.html#mysqld-8-0-13-data-types>`__
this is possible by using default value expressions, albeit in a slightly
differing syntax.

Example
-------

..  code-block:: sql
    :caption: EXT:my_extension/ext_tables.sql

    CREATE TABLE `tx_myextension_domain_model_entity` (
      `some_field` TEXT NOT NULL DEFAULT 'default-text',
      `json_field` JSON NOT NULL DEFAULT '{}'
    );

.. code-block:: php

    $connection = GeneralUtility::makeInstance(ConnectionPool::class)
        ->getConnectionByName(ConnectionPool::DEFAULT_NAME);
    $connection->insert(
        'tx_myextension_domain_model_entity',
        [
          'pid' => 123,
        ]
    );

Impact
======

Database :sql:`INSERT` queries not providing values for fields, which
have defined default values, and which are not using TCA powered TYPO3
API's can be now used, and will receive database-level defined default
values. This also accounts for dedicated applications operating directly
on the database table.

..  note::

    TCA unaware API will not consider different TCA or FORM Engine default
    value overrides and settings. So it's good to provide the basic default
    both in TCA and on database-level, if manually added.

.. index:: Database, ext:core
