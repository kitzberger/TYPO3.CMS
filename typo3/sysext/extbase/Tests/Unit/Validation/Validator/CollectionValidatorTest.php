<?php
declare(strict_types = 1);
namespace TYPO3\CMS\Extbase\Tests\Unit\Validation\Validator;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

/**
 * Test case
 */
class CollectionValidatorTest extends UnitTestCase
{
    /**
     * @var string
     */
    protected $validatorClassName = \TYPO3\CMS\Extbase\Validation\Validator\CollectionValidator::class;

    /**
     * @var \TYPO3\CMS\Extbase\Validation\ValidatorResolver
     */
    protected $mockValidatorResolver;

    /**
     * @var \TYPO3\CMS\Extbase\Validation\Validator\ValidatorInterface
     */
    protected $validator;

    /**
     * @param array $options
     * @param array $mockedMethods
     * @return \PHPUnit_Framework_MockObject_MockObject|\TYPO3\TestingFramework\Core\AccessibleObjectInterface
     */
    protected function getValidator(array $options = [], array $mockedMethods = ['translateErrorMessage'])
    {
        return $this->getAccessibleMock($this->validatorClassName, $mockedMethods, [$options], '', true);
    }

    protected function setUp()
    {
        $this->mockValidatorResolver = $this->getAccessibleMock(
            \TYPO3\CMS\Extbase\Validation\ValidatorResolver::class,
            ['createValidator', 'buildBaseValidatorConjunction', 'getBaseValidatorConjunction']
        );
        $this->validator = $this->getValidator();
        $this->validator->_set('validatorResolver', $this->mockValidatorResolver);
    }

    /**
     * @test
     */
    public function collectionValidatorReturnsNoErrorsForANullValue()
    {
        $this->assertFalse($this->validator->validate(null)->hasErrors());
    }

    /**
     * @test
     */
    public function collectionValidatorFailsForAValueNotBeingACollection()
    {
        $this->assertTrue($this->validator->validate(new \stdClass())->hasErrors());
    }

    /**
     * @test
     */
    public function collectionValidatorValidatesEveryElementOfACollectionWithTheGivenElementValidator()
    {
        // todo: this test is rather complex, consider making it a functional test with fixtures

        $this->validator->_set('options', ['elementValidator' => 'EmailAddress']);
        $this->mockValidatorResolver->expects($this->exactly(4))
            ->method('createValidator')
            ->with('EmailAddress')
            ->will($this->returnValue(
                $this->getMockBuilder(\TYPO3\CMS\Extbase\Validation\Validator\EmailAddressValidator::class)
                    ->setMethods(['translateErrorMessage'])
                    ->getMock()
            ));
        $this->validator->_set('validatorResolver', $this->mockValidatorResolver);
        $arrayOfEmailAddresses = [
            'foo@bar.de',
            'not a valid address',
            'dummy@typo3.org',
            'also not valid'
        ];

        $result = $this->validator->validate($arrayOfEmailAddresses);

        $this->assertTrue($result->hasErrors());
        $this->assertCount(2, $result->getFlattenedErrors());
    }

    /**
     * @test
     */
    public function collectionValidatorValidatesNestedObjectStructuresWithoutEndlessLooping()
    {
        // todo: this test is rather complex, consider making it a functional test with fixtures

        $A = new class() {
            public $b = [];
            public $integer = 5;
        };

        $B = new class() {
            public $a;
            public $c;
            public $integer = 'Not an integer';
        };

        $A->b = [$B];
        $B->a = $A;
        $B->c = [$A];

        // Create validators
        $aValidator = $this->getMockBuilder(\TYPO3\CMS\Extbase\Validation\Validator\GenericObjectValidator::class)
            ->setMethods(['translateErrorMessage'])
            ->setConstructorArgs([[]])
            ->getMock();
        $this->validator->_set('options', ['elementValidator' => 'Integer']);
        $integerValidator = $this->getMockBuilder(\TYPO3\CMS\Extbase\Validation\Validator\IntegerValidator::class)
            ->setMethods(['translateErrorMessage'])
            ->setConstructorArgs([[]])
            ->getMock();

        $this->mockValidatorResolver->expects($this->any())
            ->method('createValidator')
            ->with('Integer')
            ->will($this->returnValue($integerValidator));
        $this->mockValidatorResolver->expects($this->any())
            ->method('buildBaseValidatorConjunction')
            ->will($this->returnValue($aValidator));

        // Add validators to properties
        $aValidator->addPropertyValidator('b', $this->validator);
        $aValidator->addPropertyValidator('integer', $integerValidator);

        $result = $aValidator->validate($A)->getFlattenedErrors();
        $this->assertEquals(1221560494, $result['b.0'][0]->getCode());
    }

    /**
     * @test
     */
    public function collectionValidatorIsValidEarlyReturnsOnUnitializedLazyObjectStorages()
    {
        // todo: this test is rather complex, consider making it a functional test with fixtures

        $parentObject  = new \TYPO3\CMS\Extbase\Tests\Fixture\Entity('Foo');
        $elementType = \TYPO3\CMS\Extbase\Tests\Fixture\Entity::class;
        $lazyObjectStorage = new \TYPO3\CMS\Extbase\Persistence\Generic\LazyObjectStorage(
            $parentObject,
            'someProperty',
            ['someNotEmptyValue']
        );
        \TYPO3\CMS\Extbase\Reflection\ObjectAccess::setProperty($lazyObjectStorage, 'isInitialized', false, true);
        // only in this test case we want to mock the isValid method
        $validator = $this->getValidator(['elementType' => $elementType], ['isValid']);
        $validator->expects($this->never())->method('isValid');
        $this->mockValidatorResolver->expects($this->never())->method('createValidator');
        $validator->validate($lazyObjectStorage);
    }

    /**
     * @test
     */
    public function collectionValidatorCallsCollectionElementValidatorWhenValidatingObjectStorages()
    {
        // todo: this test is rather complex, consider making it a functional test with fixtures

        $entity = new \TYPO3\CMS\Extbase\Tests\Fixture\Entity('Foo');
        $elementType = \TYPO3\CMS\Extbase\Tests\Fixture\Entity::class;
        $objectStorage = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $objectStorage->attach($entity);
        $aValidator = new \TYPO3\CMS\Extbase\Validation\Validator\GenericObjectValidator([]);

        $this->mockValidatorResolver->expects($this->never())->method('createValidator');
        $this->mockValidatorResolver->expects($this->once())
            ->method('getBaseValidatorConjunction')
            ->with($elementType)
            ->will($this->returnValue($aValidator));

        $this->validator->_set('options', ['elementType' => $elementType]);

        $this->validator->validate($objectStorage);
    }
}
