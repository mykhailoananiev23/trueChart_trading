import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { environment } from "src/environments/environment";
import {
  IResult,
  PaymentRequestModel,
  StripSubscriptionResponseModel,
  SubscriptionCreateResponse,
} from "../models/stripe.model";

@Injectable({
  providedIn: "root",
})
export class StripeAPIService {
  private readonly truchartsAPI = environment.truchartsAPI;

  constructor(private _http: HttpClient) {}

  confirmCardPayment(
    model: PaymentRequestModel
  ): Observable<IResult<SubscriptionCreateResponse>> {
    return this._http.post<IResult<SubscriptionCreateResponse>>(
      this.truchartsAPI + "/subscript/createsubscription",
      model
    );
  }

  GetTrialSubscription(): Observable<StripSubscriptionResponseModel> {
    return this._http.get<StripSubscriptionResponseModel>(
      this.truchartsAPI + "/subscript/GetTrialSubscription"
    );
  }

  GetSubscription(): Observable<StripSubscriptionResponseModel> {
    return this._http.get<StripSubscriptionResponseModel>(
      this.truchartsAPI + "/subscript/GetSubscription"
    );
  }
}
