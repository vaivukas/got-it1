class Product < ApplicationRecord
  include AlgoliaSearch
  belongs_to :user
  has_many :requests
  has_many :reviews, through: :requests, dependent: :destroy
  validates :photo, presence: true

  # after_commit :index_in_algolia


  # --- Google Maps api ---
  geocoded_by :address
  after_validation :geocode, if: :address_changed?
  # -----------------------


  # --- Cloudinary --------
  mount_uploader :photo, PhotoUploader
  # -----------------------


  # --- Algolia Search ---
  algoliasearch do
    attribute :name, :description, :price_per_day, :deposit, :address, :handover_fee, :user_id
    attribute :photo do
      self.photo.metadata['url']
    end
    attribute :owner_photo do
      self.user.profile_photo.metadata['url']
    end

    attribute :rating do
      total = 0;
      counter = 0;
      self.reviews.each do |review|
        total += review.overall.to_i
        counter += 1
      end
      rating = total/counter
    end

    geoloc :latitude, :longitude
    searchableAttributes ['name', 'description']
  end
  # ----------------------

  private
end
