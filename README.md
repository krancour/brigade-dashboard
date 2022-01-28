# Kashti: TNG (A Brigade v2 Dashboard)

This is a _highly volatile prototype_ for a web-based, v2-compatible, Brigade
dashboard.

## Installation

Your mileage may vary:

```console
$ helm install kashti-tng \
    charts/kashti-tng \
    --create-namespace \
    --namespace kashti-tng \
    --wait \
    --timeout 300s \
    --set image.repository=<image location> \
    --set image.tag=<image tag> \
    --set host=<where the dashboard will live> \
    --set brigade.apiAddress=<public address of your Brigade v2 API server>
```

## Contributing

The Brigade project accepts contributions via GitHub pull requests. The
[Contributing](CONTRIBUTING.md) document outlines the process to help get your
contribution accepted.

## Support & Feedback

We have a slack channel!
[Kubernetes/#brigade](https://kubernetes.slack.com/messages/C87MF1RFD) Feel free
to join for any support questions or feedback, we are happy to help. To report
an issue or to request a feature open an issue
[here](https://github.com/brigadecore/kashti-tng/issues)

## Code of Conduct

Participation in the Brigade project is governed by the
[CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).
