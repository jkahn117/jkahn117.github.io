import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function SpeakingSection({ children, ...props }) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Appearance({ title, description, event, cta, href }) {
  return (
    <Card as="article">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Eyebrow decorate>{event}</Card.Eyebrow>
      <Card.Description>{description}</Card.Description>
      <Card.Cta>{cta}</Card.Cta>
    </Card>
  )
}

export const metadata = {
  title: 'Speaking',
  description:
    'Speaking gigs at conferences, etc.',
}

export default function Speaking() {
  return (
    <SimpleLayout
      title="Speaking opportunities."
      intro="One of my favorite ways to interact is live, in-person; though many of the best conversations aren't recorded."
    >
      <div className="space-y-20">
        <SpeakingSection title="Conferences">
          <Appearance
            href="https://www.youtube.com/watch?v=HSyE9nS5mMs"
            title="Patterns for Building Event-driven Web & Mobile App Backends"
            description="User interfaces by their nature are event driven - interactions trigger events that drive the application. But integrations between frontend and backend are often built synchronously using a request/response pattern. This session explores patterns to enable asynchronous, event-driven integrations with the frontend. It's designed for architects, frontend, backend, and full-stack engineers. You will leave with real-world patterns that bring the agility and responsiveness of EDA across client-server interactions."
            event="GOTO EDA Day 2024 - Warsaw"
            cta="Video coming soon"
          />
          <Appearance
            href="https://www.youtube.com/watch?v=okshuSlDSpk&list=PLEx5khR4g7PJO9-CeWVBJ8If1C4jg7brx&index=9"
            title="Patterns for Building Event-driven Web & Mobile App Backends"
            description="User interfaces by their nature are event driven - interactions trigger events that drive the application. But integrations between frontend and backend are often built synchronously using a request/response pattern. This session explores patterns to enable asynchronous, event-driven integrations with the frontend. It's designed for architects, frontend, backend, and full-stack engineers. You will leave with real-world patterns that bring the agility and responsiveness of EDA across client-server interactions."
            event="GOTO EDA Day 2024 - London"
            cta="Watch video"
          />
          <Appearance
            href="https://www.youtube.com/watch?v=U6Zz_Bj6yEY"
            title="Building APIs: Choosing the best API solution & strategy for workloads (SVS301)"
            description="Developers are building large-scale distributed applications that communicate between each other and clients via REST, GraphQL, WebSockets, and other means. Building effective APIs includes both a strategy and a means to communicate developer-level API details. In this session, learn about access patterns and how to evaluate the best API technology for your applications. The session considers the features and benefits of Amazon API Gateway, AWS AppSync, Amazon VPC Lattice, and other options."
            event="AWS re:Invent 2023"
            cta="Watch video"
          />
          <Appearance
            href="https://www.youtube.com/watch?v=A8iHQjHv8nY"
            title="Architecting secure serverless applications (SVS302)"
            description="This session explores how to think about security from the front to the back of a typical serverless application. How do you configure AWS serverless services to provide least-privileged access while helping to ensure functionality? How should you think about managing IAM policies for your AWS Lambda functions? This session covers all of this and more, leaving you with concrete examples applicable to almost any workload."
            event="AWS re:Invent 2022"
            cta="Watch video"
          />
          <Appearance
            href="https://www.youtube.com/watch?v=ZplOXryhX4k"
            title="Handling errors in a serverless world (SVS311)"
            description="Serverless technologies introduced new ways to build highly scalable, resilient applications without managing infrastructure. When building serverless applications by using several managed services, how should you handle errors? Should you include a try/catch block in your code or let the service deal with errors? What if the function is invoked as a task in an AWS Step Functions state machine? Can AWS Lambda Destinations help? In this session, explore error handling across Lambda invocation models and discuss patterns for proper visibility and retry behavior. Leave this session with a better understanding of how to code and/or configure services to better deal with errors across different use cases."
            event="AWS re:Invent 2020 (virtual)"
            cta="Watch video"
          />
        </SpeakingSection>

        <SpeakingSection title="Webinars">
          <Appearance
              href="https://www.youtube.com/watch?v=OJD3UMuU8Zk"
              title="Building Modern Apps with AWS: Choosing the Approach that Works for You"
              description="In this companion video to the AWS Modern Apps decision guide, decision guide manager Geof Wheelwright talks to co-author and AWS Serverless Tech Leader Josh Kahn about what goes into finding the right operational model for your modern app development and explains how the guide can help."
              event="AWS Modern Apps Decision Guide"
              cta="Watch video"
            />
        </SpeakingSection>
      </div>
    </SimpleLayout>
  )
}
