package inspections.filters

import groovy.transform.CompileStatic
import inspections.pogos.slack.messages.SlackMessage
import io.micronaut.context.annotation.Property
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher

import javax.inject.Singleton

@Singleton
@CompileStatic
@Filter("/api/**")
class SlackFilter implements HttpClientFilter {

	@Property(name = "slack.app.notifier.token")
	String token

	@Property(name = "slack.channel.id.inspections")
	String channelId

	@Override
    Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request, ClientFilterChain chain) {
		request.header("Authorization", "Bearer $token")
		((SlackMessage) request.body.get()).channel = channelId
		chain.proceed(request)
	}

}
