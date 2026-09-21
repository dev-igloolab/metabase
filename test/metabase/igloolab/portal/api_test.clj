(ns metabase.igloolab.portal.api-test
  (:require
   [clojure.test :refer :all]
   [metabase.igloolab.models.user-portal :as portal]
   [metabase.test :as mt]
   [metabase.test.fixtures :as fixtures]))

(use-fixtures :once (fixtures/initialize :test-users-personal-collections :notifications))

(deftest administrator-controls-interface-test
  (mt/with-temp [:model/User {id :id} {}]
    (is (= "metabase" (portal/user-interface id)))
    (is (= {:interface_type "portal"}
           (mt/user-http-request :crowberto :put 200 (str "igloolab/portal/user/" id)
                                 {:interface_type "portal"})))
    (is (= "portal" (portal/user-interface id)))
    (mt/user-http-request :crowberto :put 400 (str "igloolab/portal/user/" id)
                          {:interface_type "invalid"})
    (is (= {:interface_type "metabase"}
           (mt/user-http-request :crowberto :put 200 (str "igloolab/portal/user/" id)
                                 {:interface_type "metabase"})))
    (is (= "metabase" (portal/user-interface id)))))

(deftest administrator-lists-explicit-assignments-test
  (mt/with-temp [:model/User {id :id} {}]
    (portal/set-user-interface! id "portal")
    (is (some #(= {:user_id id, :interface_type "portal"} %)
              (mt/user-http-request :crowberto :get 200 "igloolab/portal/assignments")))))

(deftest regular-user-cannot-administer-interfaces-test
  (let [id (mt/user->id :rasta)]
    (mt/user-http-request :rasta :get 403 "igloolab/portal/assignments")
    (mt/user-http-request :rasta :put 403 (str "igloolab/portal/user/" id)
                          {:interface_type "portal"})
    (is (= {:interface_type "metabase"}
           (mt/user-http-request :rasta :get 200 "igloolab/portal/current")))))

(deftest administrator-always-uses-metabase-test
  (portal/set-user-interface! (mt/user->id :crowberto) "portal")
  (try
    (is (= {:interface_type "metabase"}
           (mt/user-http-request :crowberto :get 200 "igloolab/portal/current")))
    (finally
      (portal/set-user-interface! (mt/user->id :crowberto) "metabase"))))
