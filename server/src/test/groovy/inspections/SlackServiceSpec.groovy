package inspections


import inspections.services.SlackService
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class SlackServiceSpec extends Specification {

	// region Collaborators

	@Inject SlackService slackService

	// endregion

	// region Send message

//	void "test send message"() {
//		given:
//		SlackMessage message = Builder.Slack.buildSavedInspectionMessage(
//			new SavedInspection(orderNumber: 1234, numberPlate: '112233ABC', employeeCode: '1234'),
//			10,
//			new Exception("horror!")
//		)
//
//		when:
//		HttpResponse response = slackService.sendMessage(message)
//
//		then:
//		response
//		response.status == HttpStatus.OK
//		Map<String, Object> body = (Map<String, Object>) response.body()
//		body["ok"] == true
//	}

	// endregion

}
