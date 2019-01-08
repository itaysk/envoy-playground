.PHONY:docker
docker:
	docker build -t itaysk/envoy-playground:latest ./app

.PHONY:deploy
deploy:
	kubectl create -f ./deploy/
	kubectl wait pod --for=condition=READY -l app=envoy-playground
	kubectl get svc -l app=envoy-playground

.PHONY:iterate
iterate:
	kubectl get po | grep playground | awk '{print $$1}' | xargs kubectl delete po --now
	kubectl create -f ./deploy/dep-playground.yaml
	kubectl wait pod --for=condition=READY -l app=envoy-playground

.PHONY:kube-logs
kube-logs:
	kubectl get po | grep playground | awk '{print $$1}' | xargs kubectl logs -f -c playground