/**
 * SharpApiSubscriptionInfo DTO
 */
class SharpApiSubscriptionInfo {
  constructor({
    timestamp,
    on_trial,
    trial_ends,
    subscribed,
    current_subscription_start,
    current_subscription_end,
    subscription_words_quota,
    subscription_words_used,
    subscription_words_used_percentage,
  }) {
    this.timestamp = new Date(timestamp);
    this.on_trial = on_trial;
    this.trial_ends = new Date(trial_ends);
    this.subscribed = subscribed;
    this.current_subscription_start = new Date(current_subscription_start);
    this.current_subscription_end = new Date(current_subscription_end);
    this.subscription_words_quota = subscription_words_quota;
    this.subscription_words_used = subscription_words_used;
    this.subscription_words_used_percentage = subscription_words_used_percentage;
  }

  toJSON() {
    return {
      timestamp: this.timestamp,
      on_trial: this.on_trial,
      trial_ends: this.trial_ends,
      subscribed: this.subscribed,
      current_subscription_start: this.current_subscription_start,
      current_subscription_end: this.current_subscription_end,
      subscription_words_quota: this.subscription_words_quota,
      subscription_words_used: this.subscription_words_used,
      subscription_words_used_percentage: this.subscription_words_used_percentage,
    };
  }
}

module.exports = { SharpApiSubscriptionInfo };

