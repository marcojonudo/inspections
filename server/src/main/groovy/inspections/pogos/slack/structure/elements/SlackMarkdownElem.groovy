package inspections.pogos.slack.structure.elements

import groovy.transform.CompileStatic

@CompileStatic
class SlackMarkdownElem extends SlackBaseElem {

    String text

    SlackMarkdownElem(String text) {
        super("mrkdwn")
        this.text = text
    }

}
