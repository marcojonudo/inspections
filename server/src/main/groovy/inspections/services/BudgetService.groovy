package inspections.services

import groovy.transform.CompileStatic
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Singleton

@Singleton
@CompileStatic
class BudgetService {

	private static final Logger LOG = LoggerFactory.getLogger(BudgetService)

	List<Integer> savingBudgetOrderNumbers = []

	void addSavingBudgetOrderNumber(int orderNumber) {
		LOG.info("Adding saving budget order number: $orderNumber (${savingBudgetOrderNumbers.size()})")
		savingBudgetOrderNumbers << orderNumber
	}

	void removeSavingBudgetOrderNumber(int orderNumber) {
		LOG.info("Removing saving budget order number: $orderNumber (${savingBudgetOrderNumbers.size()})")
		savingBudgetOrderNumbers.removeIf { it == orderNumber }
	}

	boolean checkSavingOrderNumberBudget(int orderNumber) {
		LOG.info("Check saving order number budget: $orderNumber")
		return savingBudgetOrderNumbers.find { it == orderNumber }
	}

}
